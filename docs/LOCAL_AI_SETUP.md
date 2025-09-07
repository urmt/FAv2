# Local AI Setup and Training Guide

## 🎯 **Overview**

This guide explains how to set up and train local AI models for the CLI Tool, ensuring completely free and private AI-powered code generation and analysis.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Interface │    │   Local AI      │    │   Model         │
│   (React)       │◄──►│   Service       │◄──►│   Repository   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   System APIs   │
                       │   (Python)      │
                       └─────────────────┘
```

## 📦 **Required Components**

### **1. Local AI Service**
```bash
# Create the AI service directory
mkdir -p local-ai-service
cd local-ai-service

# Initialize Python project
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install transformers accelerate bitsandbytes
pip install fastapi uvicorn pydantic
pip install sentencepiece protobuf
```

### **2. Model Management System**
```python
# models/model_manager.py
import os
import json
from typing import Dict, List, Optional
from huggingface_hub import snapshot_download, hf_hub_download
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModelForSequenceClassification

class LocalAIManager:
    def __init__(self, models_dir: str = "./models"):
        self.models_dir = models_dir
        self.loaded_models: Dict[str, any] = {}
        self.model_configs = self._load_model_configs()
        
    def _load_model_configs(self) -> Dict:
        """Load model configurations"""
        configs_path = os.path.join(self.models_dir, "configs.json")
        if os.path.exists(configs_path):
            with open(configs_path, 'r') as f:
                return json.load(f)
        return self._get_default_configs()
    
    def _get_default_configs(self) -> Dict:
        """Get default model configurations"""
        return {
            "codebert-small": {
                "name": "CodeBERT Small",
                "model_id": "microsoft/codebert-small",
                "type": "encoder",
                "max_length": 512,
                "device": "auto",
                "quantization": None
            },
            "distilgpt2-code": {
                "name": "DistilGPT2 Code",
                "model_id": "distilgpt2",
                "type": "decoder",
                "max_length": 1024,
                "device": "auto",
                "quantization": "8bit"
            },
            "tinyllama": {
                "name": "TinyLLaMA",
                "model_id": "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
                "type": "decoder",
                "max_length": 2048,
                "device": "auto",
                "quantization": "4bit"
            }
        }
    
    def download_model(self, model_name: str) -> bool:
        """Download a model from Hugging Face"""
        if model_name not in self.model_configs:
            print(f"Model {model_name} not found in configurations")
            return False
        
        config = self.model_configs[model_name]
        model_path = os.path.join(self.models_dir, model_name)
        
        try:
            print(f"Downloading {config['name']}...")
            snapshot_download(
                repo_id=config["model_id"],
                local_dir=model_path,
                local_dir_use_symlinks=False
            )
            print(f"Model {model_name} downloaded successfully")
            return True
        except Exception as e:
            print(f"Failed to download model {model_name}: {e}")
            return False
    
    def load_model(self, model_name: str) -> bool:
        """Load a model into memory"""
        if model_name in self.loaded_models:
            print(f"Model {model_name} already loaded")
            return True
        
        if model_name not in self.model_configs:
            print(f"Model {model_name} not found in configurations")
            return False
        
        config = self.model_configs[model_name]
        model_path = os.path.join(self.models_dir, model_name)
        
        if not os.path.exists(model_path):
            print(f"Model {model_name} not found. Downloading...")
            if not self.download_model(model_name):
                return False
        
        try:
            print(f"Loading {config['name']}...")
            
            # Determine device
            device = "cuda" if torch.cuda.is_available() and config["device"] == "auto" else config["device"]
            
            # Load tokenizer
            tokenizer = AutoTokenizer.from_pretrained(model_path)
            
            # Load model with quantization if specified
            if config.get("quantization") == "8bit":
                model = AutoModelForCausalLM.from_pretrained(
                    model_path,
                    device_map="auto",
                    load_in_8bit=True
                )
            elif config.get("quantization") == "4bit":
                model = AutoModelForCausalLM.from_pretrained(
                    model_path,
                    device_map="auto",
                    load_in_4bit=True
                )
            else:
                model = AutoModelForCausalLM.from_pretrained(model_path).to(device)
            
            self.loaded_models[model_name] = {
                "model": model,
                "tokenizer": tokenizer,
                "config": config,
                "device": device
            }
            
            print(f"Model {model_name} loaded successfully on {device}")
            return True
            
        except Exception as e:
            print(f"Failed to load model {model_name}: {e}")
            return False
    
    def generate_code(self, model_name: str, prompt: str, max_length: int = None) -> str:
        """Generate code using a loaded model"""
        if model_name not in self.loaded_models:
            print(f"Model {model_name} not loaded")
            return ""
        
        model_data = self.loaded_models[model_name]
        model = model_data["model"]
        tokenizer = model_data["tokenizer"]
        config = model_data["config"]
        
        # Prepare input
        inputs = tokenizer(prompt, return_tensors="pt").to(model_data["device"])
        
        # Generate
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                max_length=max_length or config["max_length"],
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode and return
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text[len(prompt):].strip()
    
    def analyze_code(self, model_name: str, code: str) -> Dict:
        """Analyze code using a loaded model"""
        if model_name not in self.loaded_models:
            print(f"Model {model_name} not loaded")
            return {}
        
        # This is a simplified analysis - in practice, you'd use specific models
        # for different types of analysis (bug detection, complexity, etc.)
        model_data = self.loaded_models[model_name]
        tokenizer = model_data["tokenizer"]
        
        # For demonstration, return basic metrics
        lines = code.split('\n')
        return {
            "line_count": len(lines),
            "complexity": "medium",  # Simplified
            "suggestions": [
                "Consider adding comments",
                "Check for potential optimizations"
            ]
        }
```

### **3. FastAPI Service**
```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from models.model_manager import LocalAIManager

app = FastAPI(title="Local AI Service", version="1.0.0")

# Initialize AI manager
ai_manager = LocalAIManager()

class CodeGenerationRequest(BaseModel):
    model_name: str
    prompt: str
    max_length: Optional[int] = 512

class CodeGenerationResponse(BaseModel):
    generated_code: str
    model_used: str
    processing_time: float

class CodeAnalysisRequest(BaseModel):
    model_name: str
    code: str

class CodeAnalysisResponse(BaseModel):
    analysis: dict
    model_used: str
    processing_time: float

@app.get("/")
async def root():
    return {"message": "Local AI Service is running"}

@app.get("/models")
async def list_models():
    return {"models": list(ai_manager.model_configs.keys())}

@app.post("/generate")
async def generate_code(request: CodeGenerationRequest):
    import time
    start_time = time.time()
    
    # Load model if not already loaded
    if request.model_name not in ai_manager.loaded_models:
        success = ai_manager.load_model(request.model_name)
        if not success:
            raise HTTPException(status_code=400, detail=f"Failed to load model {request.model_name}")
    
    # Generate code
    generated_code = ai_manager.generate_code(
        request.model_name, 
        request.prompt, 
        request.max_length
    )
    
    processing_time = time.time() - start_time
    
    return CodeGenerationResponse(
        generated_code=generated_code,
        model_used=request.model_name,
        processing_time=processing_time
    )

@app.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    import time
    start_time = time.time()
    
    # Load model if not already loaded
    if request.model_name not in ai_manager.loaded_models:
        success = ai_manager.load_model(request.model_name)
        if not success:
            raise HTTPException(status_code=400, detail=f"Failed to load model {request.model_name}")
    
    # Analyze code
    analysis = ai_manager.analyze_code(request.model_name, request.code)
    
    processing_time = time.time() - start_time
    
    return CodeAnalysisResponse(
        analysis=analysis,
        model_used=request.model_name,
        processing_time=processing_time
    )

@app.post("/models/{model_name}/download")
async def download_model(model_name: str):
    success = ai_manager.download_model(model_name)
    if success:
        return {"message": f"Model {model_name} downloaded successfully"}
    else:
        raise HTTPException(status_code=400, detail=f"Failed to download model {model_name}")

@app.post("/models/{model_name}/load")
async def load_model(model_name: str):
    success = ai_manager.load_model(model_name)
    if success:
        return {"message": f"Model {model_name} loaded successfully"}
    else:
        raise HTTPException(status_code=400, detail=f"Failed to load model {model_name}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **4. Requirements File**
```txt
# requirements.txt
torch>=2.0.0
torchvision>=0.15.0
torchaudio>=2.0.0
transformers>=4.30.0
accelerate>=0.20.0
bitsandbytes>=0.39.0
fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
sentencepiece>=0.1.99
protobuf>=4.23.0
huggingface-hub>=0.16.0
```

## 🚀 **Setup Instructions**

### **1. Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool

# Setup the local AI service
cd local-ai-service
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create models directory
mkdir -p models
```

### **2. Download Models**
```bash
# Start the AI service
python main.py &

# Download lightweight models (CPU-friendly)
curl -X POST "http://localhost:8000/models/codebert-small/download"
curl -X POST "http://localhost:8000/models/distilgpt2-code/download"

# For GPU users, download larger models
curl -X POST "http://localhost:8000/models/tinyllama/download"
```

### **3. Test the Service**
```bash
# Test code generation
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "distilgpt2-code",
    "prompt": "def fibonacci(n):",
    "max_length": 200
  }'

# Test code analysis
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "codebert-small",
    "code": "def hello_world():\n    print(\"Hello, World!\")"
  }'
```

## 🎓 **Training Your Own Models**

### **1. Fine-tuning on Custom Code**
```python
# training/fine_tune.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from datasets import load_dataset
import os

def fine_tune_model(base_model_name, dataset_path, output_dir):
    """Fine-tune a model on custom code dataset"""
    
    # Load model and tokenizer
    model = AutoModelForCausalLM.from_pretrained(base_model_name)
    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    
    # Load dataset
    dataset = load_dataset('text', data_files=dataset_path)
    
    # Tokenize dataset
    def tokenize_function(examples):
        return tokenizer(examples['text'], padding="max_length", truncation=True, max_length=512)
    
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=4,
        save_steps=10_000,
        save_total_limit=2,
        logging_steps=100,
        learning_rate=5e-5,
        weight_decay=0.01,
        fp16=torch.cuda.is_available(),
    )
    
    # Create trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset['train'],
        eval_dataset=tokenized_dataset['test'] if 'test' in tokenized_dataset else None,
    )
    
    # Start training
    trainer.train()
    
    # Save model
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    print(f"Model fine-tuned and saved to {output_dir}")

# Example usage
if __name__ == "__main__":
    fine_tune_model(
        base_model_name="distilgpt2",
        dataset_path="data/my_code_dataset.txt",
        output_dir="models/my-fine-tuned-model"
    )
```

### **2. Preparing Training Data**
```python
# data/prepare_dataset.py
import os
import json
from pathlib import Path

def collect_code_files(directory, extensions= ['.py', '.js', '.ts', '.java', '.cpp', '.c']):
    """Collect code files from a directory"""
    code_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        code_files.append(content)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return code_files

def create_training_dataset(code_files, output_file):
    """Create a training dataset from code files"""
    with open(output_file, 'w', encoding='utf-8') as f:
        for code in code_files:
            # Add some structure to help the model learn
            formatted_code = f"<|code|>\n{code}\n<|endoftext|>\n"
            f.write(formatted_code + '\n')
    
    print(f"Training dataset created with {len(code_files)} code samples")

# Example usage
if __name__ == "__main__":
    # Collect code from your projects
    code_files = collect_code_files("/path/to/your/projects")
    
    # Create training dataset
    create_training_dataset(code_files, "data/my_code_dataset.txt")
```

### **3. Training Script**
```bash
#!/bin/bash

# training/train_model.sh

echo "Starting model training..."

# Set environment variables
export CUDA_VISIBLE_DEVICES=0
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Create output directory
mkdir -p models/trained

# Run fine-tuning
python training/fine_tune.py \
  --base_model_name "distilgpt2" \
  --dataset_path "data/my_code_dataset.txt" \
  --output_dir "models/trained/my-code-model"

echo "Training completed. Model saved to models/trained/my-code-model"
```

## 🔧 **Integration with Web Interface**

### **Update the AI Service Integration**
```typescript
// src/services/aiService.ts - Updated for real local AI
export interface LocalAIModel {
  id: string
  name: string
  description: string
  size: string
  status: 'available' | 'loading' | 'not_downloaded' | 'error'
  isLocal: boolean
}

export class LocalAIService {
  private baseUrl: string = 'http://localhost:8000'
  
  async getAvailableModels(): Promise<LocalAIModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`)
      const data = await response.json()
      
      return data.models.map((modelId: string) => ({
        id: modelId,
        name: modelId.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: `Local ${modelId} model`,
        size: 'Local',
        status: 'not_downloaded',
        isLocal: true
      }))
    } catch (error) {
      console.error('Failed to fetch models:', error)
      return []
    }
  }
  
  async downloadModel(modelId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/download`, {
        method: 'POST'
      })
      return response.ok
    } catch (error) {
      console.error('Failed to download model:', error)
      return false
    }
  }
  
  async loadModel(modelId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models/${modelId}/load`, {
        method: 'POST'
      })
      return response.ok
    } catch (error) {
      console.error('Failed to load model:', error)
      return false
    }
  }
  
  async generateCode(modelId: string, prompt: string, maxLength?: number): Promise<{
    generated_code: string
    model_used: string
    processing_time: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_name: modelId,
          prompt,
          max_length: maxLength
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate code')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to generate code:', error)
      throw error
    }
  }
  
  async analyzeCode(modelId: string, code: string): Promise<{
    analysis: any
    model_used: string
    processing_time: number
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_name: modelId,
          code
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to analyze code')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to analyze code:', error)
      throw error
    }
  }
}

export const localAIService = new LocalAIService()
```

## 🎯 **Usage Instructions**

### **For Users:**
1. **Install Requirements**: Follow the system requirements guide
2. **Download Models**: Use the web interface to download lightweight models
3. **Generate Code**: Use the AI-powered code generation features
4. **Analyze Code**: Get AI-powered code analysis and suggestions

### **For Developers:**
1. **Setup Development Environment**: Install Python, Node.js, and required dependencies
2. **Custom Models**: Fine-tune models on your own codebase
3. **Extend Functionality**: Add new models and features to the AI service
4. **Contribute**: Submit improvements and bug fixes

## 📚 **Additional Resources**

### **Documentation:**
- [Hugging Face Transformers Documentation](https://huggingface.co/docs/transformers/)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

### **Model Repositories:**
- [Hugging Face Model Hub](https://huggingface.co/models)
- [CodeBERT Models](https://huggingface.co/microsoft/codebert)
- [GPT-2 Models](https://huggingface.co/gpt2)

### **Community:**
- [GitHub Repository](https://github.com/yourusername/local-cli-tool)
- [Discord Server](https://discord.gg/your-server)
- [Reddit Community](https://reddit.com/r/LocalCLI)

---

*This guide provides a comprehensive foundation for setting up and using local AI models with the CLI Tool. The system is designed to be completely free, private, and extensible.*
