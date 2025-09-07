"""
Code Analyzer Service
Handles AI-powered code analysis and suggestions
"""

import asyncio
import time
import logging
import re
from typing import Dict, List, Optional, Any
import torch
from transformers import pipeline

logger = logging.getLogger(__name__)

class CodeAnalyzer:
    """Handles AI-powered code analysis"""
    
    def __init__(self, model_manager):
        self.model_manager = model_manager
        self.analysis_patterns = self._load_analysis_patterns()
        
        logger.info("CodeAnalyzer initialized")
    
    def _load_analysis_patterns(self) -> Dict:
        """Load code analysis patterns for different languages"""
        return {
            "python": {
                "unused_imports": re.compile(r'^import\s+(\w+)(?:\s+as\s+\w+)?$', re.MULTILINE),
                "long_functions": re.compile(r'def\s+(\w+).*?:\s*(?:.*\n)*?.{150,}', re.MULTILINE),
                "complex_conditionals": re.compile(r'if\s+.*\s+(?:and|or)\s+.*\s+(?:and|or)', re.MULTILINE),
                "magic_numbers": re.compile(r'\b\d+\b(?!\s*#.*magic)', re.MULTILINE),
                "bare_except": re.compile(r'except\s*:', re.MULTILINE),
            },
            "javascript": {
                "unused_vars": re.compile(r'(?:let|const|var)\s+(\w+)(?:\s*=\s*[^;]+)?;', re.MULTILINE),
                "long_functions": re.compile(r'function\s+(\w+).*\{.*\}', re.MULTILINE | re.DOTALL),
                "global_vars": re.compile(r'(?:let|const|var)\s+(\w+)\s*=\s*[^;]+;', re.MULTILINE),
                "eval_usage": re.compile(r'eval\s*\(', re.MULTILINE),
                "strict_mode": re.compile(r'\"use strict\"', re.MULTILINE),
            },
            "java": {
                "long_methods": re.compile(r'public\s+\w+\s+\w+\s*\([^)]*\)\s*\{.*\}', re.MULTILINE | re.DOTALL),
                "unused_imports": re.compile(r'import\s+[\w.]+;', re.MULTILINE),
                "magic_numbers": re.compile(r'\b\d+\b(?!\s*//.*magic)', re.MULTILINE),
                "empty_catch": re.compile(r'catch\s*\([^)]*\)\s*\{\s*\}', re.MULTILINE),
            },
            "cpp": {
                "memory_leaks": re.compile(r'new\s+\w+.*?(?!\s*delete)', re.MULTILINE | re.DOTALL),
                "raw_pointers": re.compile(r'\w+\s*\*\s*\w+', re.MULTILINE),
                "long_functions": re.compile(r'\w+\s+\w+\s*\([^)]*\)\s*\{.*\}', re.MULTILINE | re.DOTALL),
                "unused_vars": re.compile(r'\w+\s+\w+\s*=.*?(?!\s*//.*used)', re.MULTILINE),
            }
        }
    
    async def analyze_code(
        self,
        model_name: str,
        code: str,
        language: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze code using AI models"""
        
        start_time = time.time()
        
        try:
            # Get the model
            model_info = self.model_manager.get_model(model_name)
            if not model_info:
                raise ValueError(f"Model {model_name} not loaded")
            
            logger.info(f"Analyzing code with model {model_name}")
            
            # Perform analysis
            analysis_results = await self._perform_analysis(model_info, code, language)
            
            # Generate suggestions
            suggestions = await self._generate_suggestions(model_info, code, analysis_results, language)
            
            # Calculate metrics
            processing_time = time.time() - start_time
            
            logger.info(f"Code analysis completed in {processing_time:.2f}s")
            
            return {
                "analysis": analysis_results,
                "model_used": model_name,
                "processing_time": processing_time,
                "suggestions": suggestions
            }
            
        except Exception as e:
            logger.error(f"Error analyzing code: {e}")
            raise
    
    async def _perform_analysis(self, model_info, code: str, language: Optional[str]) -> Dict[str, Any]:
        """Perform the actual code analysis"""
        
        analysis = {
            "basic_metrics": self._calculate_basic_metrics(code),
            "quality_issues": [],
            "security_issues": [],
            "performance_issues": [],
            "maintainability_issues": []
        }
        
        # Language-specific analysis
        if language and language.lower() in self.analysis_patterns:
            patterns = self.analysis_patterns[language.lower()]
            analysis["language_specific"] = self._analyze_with_patterns(code, patterns)
        
        # AI-powered analysis
        if "code-analysis" in model_info.capabilities:
            ai_analysis = await self._ai_powered_analysis(model_info, code, language)
            analysis.update(ai_analysis)
        
        return analysis
    
    def _calculate_basic_metrics(self, code: str) -> Dict[str, Any]:
        """Calculate basic code metrics"""
        
        lines = code.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        # Count lines of code
        loc = len(non_empty_lines)
        
        # Count comments
        comment_lines = 0
        for line in lines:
            stripped = line.strip()
            if stripped.startswith(('#', '//', '/*', '*', '--', '%', ';')):
                comment_lines += 1
        
        # Calculate complexity (simplified)
        complexity_keywords = ['if', 'else', 'elif', 'for', 'while', 'switch', 'case', 'try', 'except', 'catch']
        complexity = 0
        for line in non_empty_lines:
            for keyword in complexity_keywords:
                if keyword in line.lower():
                    complexity += 1
        
        # Estimate maintainability (simplified formula)
        maintainability = max(0, min(100, 100 - (complexity * 2) - (loc / 100)))
        
        return {
            "lines_of_code": loc,
            "comment_lines": comment_lines,
            "comment_ratio": comment_lines / max(1, loc),
            "complexity_score": complexity,
            "maintainability_score": maintainability
        }
    
    def _analyze_with_patterns(self, code: str, patterns: Dict) -> Dict[str, List]:
        """Analyze code using predefined patterns"""
        
        results = {}
        
        for pattern_name, pattern in patterns.items():
            matches = pattern.findall(code)
            if matches:
                results[pattern_name] = matches
        
        return results
    
    async def _ai_powered_analysis(self, model_info, code: str, language: Optional[str]) -> Dict[str, Any]:
        """Perform AI-powered code analysis"""
        
        try:
            # Create analysis prompt
            analysis_prompt = self._create_analysis_prompt(code, language)
            
            # Tokenize and get model output
            inputs = model_info.tokenizer(
                analysis_prompt,
                return_tensors="pt",
                padding=True,
                truncation=True
            )
            
            device = next(model_info.model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = model_info.model.generate(
                    **inputs,
                    max_length=512,
                    num_return_sequences=1,
                    temperature=0.3,
                    do_sample=True
                )
            
            # Decode and parse the analysis
            analysis_text = model_info.tokenizer.decode(outputs[0], skip_special_tokens=True)
            parsed_analysis = self._parse_ai_analysis(analysis_text)
            
            return parsed_analysis
            
        except Exception as e:
            logger.warning(f"AI-powered analysis failed: {e}")
            return {}
    
    def _create_analysis_prompt(self, code: str, language: Optional[str]) -> str:
        """Create a prompt for AI-powered code analysis"""
        
        lang_text = f" in {language}" if language else ""
        
        prompt = f"""Analyze the following code{lang_text} and provide insights on quality, security, performance, and maintainability:

Code:
```{language or 'text'}
{code}
```

Please provide your analysis in the following format:
QUALITY_ISSUES: [list of quality issues]
SECURITY_ISSUES: [list of security issues]  
PERFORMANCE_ISSUES: [list of performance issues]
MAINTAINABILITY_ISSUES: [list of maintainability issues]
OVERALL_SCORE: [score from 0-100]

Analysis:"""
        
        return prompt
    
    def _parse_ai_analysis(self, analysis_text: str) -> Dict[str, Any]:
        """Parse AI-generated analysis text"""
        
        parsed = {
            "quality_issues": [],
            "security_issues": [],
            "performance_issues": [],
            "maintainability_issues": [],
            "overall_score": 75  # Default score
        }
        
        try:
            # Extract sections using regex
            sections = {
                "QUALITY_ISSUES": r"QUALITY_ISSUES:\s*(.*?)(?=\n\w+_|$)",
                "SECURITY_ISSUES": r"SECURITY_ISSUES:\s*(.*?)(?=\n\w+_|$)",
                "PERFORMANCE_ISSUES": r"PERFORMANCE_ISSUES:\s*(.*?)(?=\n\w+_|$)",
                "MAINTAINABILITY_ISSUES": r"MAINTAINABILITY_ISSUES:\s*(.*?)(?=\n\w+_|$)",
                "OVERALL_SCORE": r"OVERALL_SCORE:\s*(\d+)"
            }
            
            for section_name, pattern in sections.items():
                match = re.search(pattern, analysis_text, re.DOTALL)
                if match:
                    content = match.group(1).strip()
                    if section_name == "OVERALL_SCORE":
                        parsed["overall_score"] = int(content)
                    else:
                        # Parse list items
                        items = [item.strip().lstrip('- ').lstrip('* ') for item in content.split('\n') if item.strip()]
                        parsed[section_name.lower()] = items
        
        except Exception as e:
            logger.warning(f"Failed to parse AI analysis: {e}")
        
        return parsed
    
    async def _generate_suggestions(
        self,
        model_info,
        code: str,
        analysis_results: Dict,
        language: Optional[str]
    ) -> List[Dict]:
        """Generate improvement suggestions"""
        
        suggestions = []
        
        # Generate suggestions based on analysis results
        if analysis_results.get("basic_metrics", {}).get("maintainability_score", 100) < 70:
            suggestions.append({
                "type": "refactoring",
                "description": "Consider refactoring complex functions to improve maintainability",
                "priority": "high",
                "confidence": 0.8
            })
        
        if analysis_results.get("basic_metrics", {}).get("comment_ratio", 0) < 0.1:
            suggestions.append({
                "type": "documentation",
                "description": "Add more comments to improve code readability",
                "priority": "medium",
                "confidence": 0.9
            })
        
        # Language-specific suggestions
        if language:
            lang_suggestions = self._get_language_suggestions(language, analysis_results)
            suggestions.extend(lang_suggestions)
        
        # AI-powered suggestions
        if "code-analysis" in model_info.capabilities:
            ai_suggestions = await self._generate_ai_suggestions(model_info, code, language)
            suggestions.extend(ai_suggestions)
        
        # Sort by priority and confidence
        suggestions.sort(key=lambda x: (x["priority"] == "high", x["confidence"]), reverse=True)
        
        return suggestions[:10]  # Return top 10 suggestions
    
    def _get_language_suggestions(self, language: str, analysis_results: Dict) -> List[Dict]:
        """Get language-specific suggestions"""
        
        suggestions = []
        lang_lower = language.lower()
        
        if lang_lower == "python":
            if analysis_results.get("language_specific", {}).get("bare_except"):
                suggestions.append({
                    "type": "error_handling",
                    "description": "Specify exception types in except clauses instead of bare except",
                    "priority": "high",
                    "confidence": 0.95
                })
        
        elif lang_lower == "javascript":
            if analysis_results.get("language_specific", {}).get("eval_usage"):
                suggestions.append({
                    "type": "security",
                    "description": "Avoid using eval() due to security risks",
                    "priority": "high",
                    "confidence": 0.95
                })
        
        elif lang_lower == "cpp":
            if analysis_results.get("language_specific", {}).get("memory_leaks"):
                suggestions.append({
                    "type": "memory_management",
                    "description": "Fix potential memory leaks by adding proper delete statements",
                    "priority": "high",
                    "confidence": 0.85
                })
        
        return suggestions
    
    async def _generate_ai_suggestions(
        self,
        model_info,
        code: str,
        language: Optional[str]
    ) -> List[Dict]:
        """Generate AI-powered improvement suggestions"""
        
        try:
            # Create suggestions prompt
            prompt = f"""Provide specific, actionable suggestions to improve the following {language or 'code'}:

```{language or 'text'}
{code}
```

Provide 3-5 suggestions in this format:
SUGGESTION: [type] - [description] - [priority: high/medium/low]

Suggestions:"""
            
            # Get AI response
            inputs = model_info.tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
            device = next(model_info.model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = model_info.model.generate(**inputs, max_length=300, temperature=0.4)
            
            response = model_info.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Parse suggestions
            suggestions = []
            suggestion_pattern = r"SUGGESTION:\s*(\w+)\s*-\s*([^-\n]+)\s*-\s*\[priority:\s*(\w+)\]"
            
            matches = re.findall(suggestion_pattern, response)
            for suggestion_type, description, priority in matches:
                suggestions.append({
                    "type": suggestion_type.lower(),
                    "description": description.strip(),
                    "priority": priority,
                    "confidence": 0.75
                })
            
            return suggestions
            
        except Exception as e:
            logger.warning(f"AI suggestions generation failed: {e}")
            return []
