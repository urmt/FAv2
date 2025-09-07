"""
Code Generator Service
Handles AI-powered code generation
"""

import asyncio
import time
import logging
from typing import Dict, Optional, Any
import torch
from transformers import GenerationConfig

logger = logging.getLogger(__name__)

class CodeGenerator:
    """Handles AI-powered code generation"""
    
    def __init__(self, model_manager):
        self.model_manager = model_manager
        self.generation_configs = {
            "default": GenerationConfig(
                max_length=512,
                temperature=0.7,
                do_sample=True,
                pad_token_id=50256,  # GPT-2 pad token
                eos_token_id=50256,   # GPT-2 eos token
                top_p=0.9,
                top_k=50,
                repetition_penalty=1.1,
                num_return_sequences=1
            ),
            "creative": GenerationConfig(
                max_length=1024,
                temperature=0.9,
                do_sample=True,
                pad_token_id=50256,
                eos_token_id=50256,
                top_p=0.95,
                top_k=100,
                repetition_penalty=1.0,
                num_return_sequences=1
            ),
            "precise": GenerationConfig(
                max_length=256,
                temperature=0.3,
                do_sample=True,
                pad_token_id=50256,
                eos_token_id=50256,
                top_p=0.7,
                top_k=20,
                repetition_penalty=1.2,
                num_return_sequences=1
            )
        }
        
        logger.info("CodeGenerator initialized")
    
    async def generate_code(
        self,
        model_name: str,
        prompt: str,
        language: Optional[str] = None,
        max_length: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> Dict[str, Any]:
        """Generate code using the specified model"""
        
        start_time = time.time()
        
        try:
            # Get the model
            model_info = self.model_manager.get_model(model_name)
            if not model_info:
                raise ValueError(f"Model {model_name} not loaded")
            
            logger.info(f"Generating code with model {model_name}")
            
            # Prepare the prompt
            formatted_prompt = self._format_prompt(prompt, language)
            
            # Tokenize input
            inputs = model_info.tokenizer(
                formatted_prompt,
                return_tensors="pt",
                padding=True,
                truncation=True
            )
            
            # Move to model device
            device = next(model_info.model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            # Configure generation
            generation_config = self._get_generation_config(
                temperature=temperature,
                max_length=max_length or model_info.max_length
            )
            
            # Generate code
            with torch.no_grad():
                outputs = model_info.model.generate(
                    **inputs,
                    generation_config=generation_config
                )
            
            # Decode the generated code
            generated_text = model_info.tokenizer.decode(
                outputs[0],
                skip_special_tokens=True
            )
            
            # Extract the generated part (remove the prompt)
            generated_code = generated_text[len(formatted_prompt):].strip()
            
            # Post-process the generated code
            generated_code = self._post_process_code(generated_code, language)
            
            # Calculate metrics
            processing_time = time.time() - start_time
            tokens_used = len(outputs[0])
            confidence = self._calculate_confidence(model_info, outputs)
            
            logger.info(f"Code generated successfully in {processing_time:.2f}s")
            
            return {
                "generated_code": generated_code,
                "model_used": model_name,
                "processing_time": processing_time,
                "tokens_used": tokens_used,
                "confidence": confidence
            }
            
        except Exception as e:
            logger.error(f"Error generating code: {e}")
            raise
    
    def _format_prompt(self, prompt: str, language: Optional[str] = None) -> str:
        """Format the prompt based on language"""
        
        language_templates = {
            "python": (
                "# Python Code\n"
                "# Task: {prompt}\n"
                "# Generated code:\n"
            ),
            "javascript": (
                "// JavaScript Code\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            ),
            "java": (
                "// Java Code\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            ),
            "cpp": (
                "// C++ Code\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            ),
            "go": (
                "// Go Code\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            ),
            "rust": (
                "// Rust Code\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            ),
            "html": (
                "<!-- HTML Code -->\n"
                "<!-- Task: {prompt} -->\n"
                "<!-- Generated code: -->\n"
            ),
            "css": (
                "/* CSS Code */\n"
                "/* Task: {prompt} */\n"
                "/* Generated code: */\n"
            ),
            "sql": (
                "-- SQL Code\n"
                "-- Task: {prompt}\n"
                "-- Generated code:\n"
            ),
            "bash": (
                "#!/bin/bash\n"
                "# Task: {prompt}\n"
                "# Generated code:\n"
            )
        }
        
        if language and language.lower() in language_templates:
            template = language_templates[language.lower()]
        else:
            template = (
                "// Code Generation\n"
                "// Task: {prompt}\n"
                "// Generated code:\n"
            )
        
        return template.format(prompt=prompt)
    
    def _get_generation_config(self, temperature: Optional[float], max_length: int) -> GenerationConfig:
        """Get generation configuration based on parameters"""
        
        # Select base config based on temperature
        if temperature and temperature >= 0.8:
            base_config = self.generation_configs["creative"]
        elif temperature and temperature <= 0.4:
            base_config = self.generation_configs["precise"]
        else:
            base_config = self.generation_configs["default"]
        
        # Override parameters
        config = GenerationConfig(
            max_length=max_length,
            temperature=temperature or base_config.temperature,
            do_sample=base_config.do_sample,
            pad_token_id=base_config.pad_token_id,
            eos_token_id=base_config.eos_token_id,
            top_p=base_config.top_p,
            top_k=base_config.top_k,
            repetition_penalty=base_config.repetition_penalty,
            num_return_sequences=base_config.num_return_sequences
        )
        
        return config
    
    def _post_process_code(self, code: str, language: Optional[str] = None) -> str:
        """Post-process generated code"""
        
        # Remove extra whitespace
        code = code.strip()
        
        # Remove incomplete lines at the end
        lines = code.split('\n')
        while lines and not lines[-1].strip():
            lines.pop()
        
        # Ensure the code ends with a newline
        if lines:
            code = '\n'.join(lines) + '\n'
        
        # Language-specific post-processing
        if language:
            language = language.lower()
            if language == "python":
                # Ensure Python code has proper indentation
                code = self._fix_python_indentation(code)
            elif language in ["javascript", "java", "cpp"]:
                # Ensure proper semicolons and braces
                code = self._fix_c_style_syntax(code)
        
        return code
    
    def _fix_python_indentation(self, code: str) -> str:
        """Fix Python indentation issues"""
        lines = code.split('\n')
        fixed_lines = []
        indent_level = 0
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                fixed_lines.append('')
                continue
            
            # Decrease indent for closing blocks
            if stripped.startswith(('return ', 'pass', 'break', 'continue')) or \
               stripped.startswith(('elif ', 'except ', 'finally')):
                indent_level = max(0, indent_level - 4)
            
            # Apply current indent
            fixed_lines.append(' ' * indent_level + stripped)
            
            # Increase indent for opening blocks
            if stripped.endswith(':'):
                indent_level += 4
        
        return '\n'.join(fixed_lines)
    
    def _fix_c_style_syntax(self, code: str) -> str:
        """Fix C-style syntax issues"""
        lines = code.split('\n')
        fixed_lines = []
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                fixed_lines.append('')
                continue
            
            # Add semicolons for statements that need them
            if (stripped and not stripped.endswith(('{', '}', ';', ':')) and
                not stripped.startswith(('if ', 'else ', 'for ', 'while ', 'switch ', 'case '))):
                stripped += ';'
            
            fixed_lines.append(stripped)
        
        return '\n'.join(fixed_lines)
    
    def _calculate_confidence(self, model_info, outputs) -> float:
        """Calculate confidence score for the generation"""
        
        try:
            # Get logits from the model
            with torch.no_grad():
                logits = model_info.model(outputs).logits
            
            # Calculate perplexity
            shift_logits = logits[..., :-1, :].contiguous()
            shift_labels = outputs[..., 1:].contiguous()
            
            loss_fct = torch.nn.CrossEntropyLoss(ignore_index=-100)
            loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))
            
            perplexity = torch.exp(loss).item()
            
            # Convert perplexity to confidence (lower perplexity = higher confidence)
            confidence = max(0.0, min(1.0, 1.0 - (perplexity - 1.0) / 10.0))
            
            return confidence
            
        except Exception as e:
            logger.warning(f"Could not calculate confidence: {e}")
            return 0.5  # Default confidence
