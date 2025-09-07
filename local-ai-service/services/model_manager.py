"""
Model Manager Service
Handles downloading, loading, and managing AI models
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Optional, Any
from pathlib import Path
import torch
from transformers import (
    AutoModelForCausalLM, 
    AutoModelForSequenceClassification,
    AutoTokenizer,
    BitsAndBytesConfig
)
from huggingface_hub import snapshot_download, hf_hub_download
import psutil
import gc

logger = logging.getLogger(__name__)

class ModelInfo:
    """Information about an AI model"""
    def __init__(self, model_id: str, config: Dict):
        self.id = model_id
        self.name = config.get("name", model_id)
        self.description = config.get("description", "")
        self.model_repo = config.get("model_repo", model_id)
        self.type = config.get("type", "decoder")
        self.max_length = config.get("max_length", 512)
        self.capabilities = config.get("capabilities", [])
        self.size = config.get("size", "unknown")
        self.quantization = config.get("quantization")
        self.device = config.get("device", "auto")
        self.is_loaded = False
        self.model = None
        self.tokenizer = None
        self.load_time = 0
        self.memory_usage = 0

class ModelManager:
    """Manages AI models lifecycle"""
    
    def __init__(self, models_dir: str = "./models"):
        self.models_dir = Path(models_dir)
        self.models_dir.mkdir(exist_ok=True)
        
        # Load model configurations
        self.model_configs = self._load_model_configs()
        self.models: Dict[str, ModelInfo] = {}
        
        # Initialize models from configs
        for model_id, config in self.model_configs.items():
            self.models[model_id] = ModelInfo(model_id, config)
        
        logger.info(f"ModelManager initialized with {len(self.models)} models")
    
    def _load_model_configs(self) -> Dict:
        """Load model configurations"""
        configs_path = self.models_dir / "configs.json"
        
        if configs_path.exists():
            with open(configs_path, 'r') as f:
                return json.load(f)
        
        # Default configurations
        default_configs = {
            "codebert-small": {
                "name": "CodeBERT Small",
                "description": "Lightweight code understanding and generation model",
                "model_repo": "microsoft/codebert-small",
                "type": "encoder",
                "max_length": 512,
                "capabilities": ["code-completion", "bug-detection", "documentation"],
                "size": "500MB",
                "quantization": None,
                "device": "auto"
            },
            "distilgpt2-code": {
                "name": "DistilGPT2 Code",
                "description": "Lightweight code generation model",
                "model_repo": "distilgpt2",
                "type": "decoder",
                "max_length": 1024,
                "capabilities": ["code-generation", "translation"],
                "size": "350MB",
                "quantization": "8bit",
                "device": "auto"
            },
            "tinyllama": {
                "name": "TinyLLaMA",
                "description": "Small but capable language model for code",
                "model_repo": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                "type": "decoder",
                "max_length": 2048,
                "capabilities": ["code-generation", "explanation", "refactoring"],
                "size": "2.2GB",
                "quantization": "4bit",
                "device": "auto"
            },
            "starcoderbase": {
                "name": "StarCoder Base",
                "description": "Code generation model trained on multiple languages",
                "model_repo": "bigcode/starcoderbase",
                "type": "decoder",
                "max_length": 4096,
                "capabilities": ["code-generation", "translation", "completion"],
                "size": "15GB",
                "quantization": "8bit",
                "device": "auto"
            }
        }
        
        # Save default configurations
        with open(configs_path, 'w') as f:
            json.dump(default_configs, f, indent=2)
        
        return default_configs
    
    async def list_models(self) -> List[Dict]:
        """List all available models with their status"""
        result = []
        
        for model_id, model in self.models.items():
            model_path = self.models_dir / model_id
            is_downloaded = model_path.exists()
            
            result.append({
                "id": model_id,
                "name": model.name,
                "description": model.description,
                "size": model.size,
                "status": "loaded" if model.is_loaded else "downloaded" if is_downloaded else "not_downloaded",
                "capabilities": model.capabilities,
                "is_loaded": model.is_loaded
            })
        
        return result
    
    async def download_model(self, model_id: str, force: bool = False) -> bool:
        """Download a model from Hugging Face"""
        if model_id not in self.models:
            logger.error(f"Model {model_id} not found in configurations")
            return False
        
        model = self.models[model_id]
        model_path = self.models_dir / model_id
        
        # Check if already downloaded
        if model_path.exists() and not force:
            logger.info(f"Model {model_id} already downloaded")
            return True
        
        try:
            logger.info(f"Downloading model {model_id}...")
            
            # Create model directory
            model_path.mkdir(exist_ok=True)
            
            # Download model files
            snapshot_download(
                repo_id=model.model_repo,
                local_dir=str(model_path),
                local_dir_use_symlinks=False,
                resume_download=True
            )
            
            logger.info(f"Model {model_id} downloaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to download model {model_id}: {e}")
            # Clean up partial download
            if model_path.exists():
                import shutil
                shutil.rmtree(model_path)
            return False
    
    async def load_model(self, model_id: str, device: str = "auto") -> bool:
        """Load a model into memory"""
        if model_id not in self.models:
            logger.error(f"Model {model_id} not found in configurations")
            return False
        
        model = self.models[model_id]
        model_path = self.models_dir / model_id
        
        if not model_path.exists():
            logger.error(f"Model {model_id} not downloaded")
            return False
        
        # Unload if already loaded
        if model.is_loaded:
            await self.unload_model(model_id)
        
        try:
            import time
            start_time = time.time()
            
            logger.info(f"Loading model {model_id}...")
            
            # Determine device
            if device == "auto":
                device = "cuda" if torch.cuda.is_available() else "cpu"
            
            # Load tokenizer
            model.tokenizer = AutoTokenizer.from_pretrained(model_path)
            
            # Configure quantization if specified
            quantization_config = None
            if model.quantization == "4bit":
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.float16,
                    bnb_4bit_use_double_quant=True
                )
            elif model.quantization == "8bit":
                quantization_config = BitsAndBytesConfig(
                    load_in_8bit=True
                )
            
            # Load model
            if model.type == "decoder":
                model.model = AutoModelForCausalLM.from_pretrained(
                    model_path,
                    device_map="auto" if device == "cuda" else None,
                    quantization_config=quantization_config,
                    torch_dtype=torch.float16 if device == "cuda" else torch.float32
                )
            else:  # encoder
                model.model = AutoModelForSequenceClassification.from_pretrained(
                    model_path,
                    device_map="auto" if device == "cuda" else None,
                    quantization_config=quantization_config,
                    torch_dtype=torch.float16 if device == "cuda" else torch.float32
                )
            
            # Move to device if not using device_map
            if device != "cuda" or not quantization_config:
                model.model = model.model.to(device)
            
            # Update model info
            model.is_loaded = True
            model.device = device
            model.load_time = time.time() - start_time
            
            # Calculate memory usage
            if device == "cuda":
                model.memory_usage = torch.cuda.memory_allocated(device) / 1024**3  # GB
            else:
                process = psutil.Process()
                model.memory_usage = process.memory_info().rss / 1024**3  # GB
            
            logger.info(f"Model {model_id} loaded successfully on {device} in {model.load_time:.2f}s")
            logger.info(f"Memory usage: {model.memory_usage:.2f}GB")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model {model_id}: {e}")
            # Clean up
            model.model = None
            model.tokenizer = None
            model.is_loaded = False
            return False
    
    async def unload_model(self, model_id: str) -> bool:
        """Unload a model from memory"""
        if model_id not in self.models:
            logger.error(f"Model {model_id} not found")
            return False
        
        model = self.models[model_id]
        
        if not model.is_loaded:
            logger.info(f"Model {model_id} is not loaded")
            return True
        
        try:
            logger.info(f"Unloading model {model_id}...")
            
            # Delete model and tokenizer
            del model.model
            del model.tokenizer
            
            # Force garbage collection
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            # Reset model info
            model.model = None
            model.tokenizer = None
            model.is_loaded = False
            model.memory_usage = 0
            
            logger.info(f"Model {model_id} unloaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to unload model {model_id}: {e}")
            return False
    
    def get_model(self, model_id: str) -> Optional[ModelInfo]:
        """Get a loaded model"""
        model = self.models.get(model_id)
        if model and model.is_loaded:
            return model
        return None
    
    async def cleanup(self):
        """Cleanup all loaded models"""
        logger.info("Cleaning up all models...")
        
        for model_id in list(self.models.keys()):
            if self.models[model_id].is_loaded:
                await self.unload_model(model_id)
        
        logger.info("Cleanup complete")
    
    def get_system_info(self) -> Dict:
        """Get system information for model compatibility"""
        info = {
            "cuda_available": torch.cuda.is_available(),
            "cuda_device_count": torch.cuda.device_count() if torch.cuda.is_available() else 0,
            "cpu_count": psutil.cpu_count(),
            "memory_total": psutil.virtual_memory().total / 1024**3,  # GB
            "memory_available": psutil.virtual_memory().available / 1024**3,  # GB
            "disk_free": psutil.disk_usage('/').free / 1024**3,  # GB
        }
        
        if torch.cuda.is_available():
            info["cuda_devices"] = []
            for i in range(torch.cuda.device_count()):
                device_props = torch.cuda.get_device_properties(i)
                info["cuda_devices"].append({
                    "id": i,
                    "name": device_props.name,
                    "memory_total": device_props.total_memory / 1024**3,  # GB
                    "memory_allocated": torch.cuda.memory_allocated(i) / 1024**3,  # GB
                })
        
        return info
