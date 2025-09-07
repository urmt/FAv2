#!/usr/bin/env python3
"""
Local AI Service for CLI Tool
Provides AI-powered code generation and analysis using local models
"""

import os
import sys
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, List, Optional

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Import our services
from services.model_manager import ModelManager
from services.code_generator import CodeGenerator
from services.code_analyzer import CodeAnalyzer
from services.performance_monitor import PerformanceMonitor
from services.health_checker import HealthChecker

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_service.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Global service instances
model_manager: Optional[ModelManager] = None
code_generator: Optional[CodeGenerator] = None
code_analyzer: Optional[CodeAnalyzer] = None
performance_monitor: Optional[PerformanceMonitor] = None
health_checker: Optional[HealthChecker] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model_manager, code_generator, code_analyzer, performance_monitor, health_checker
    
    logger.info("Starting Local AI Service...")
    
    # Initialize services
    try:
        model_manager = ModelManager()
        code_generator = CodeGenerator(model_manager)
        code_analyzer = CodeAnalyzer(model_manager)
        performance_monitor = PerformanceMonitor()
        health_checker = HealthChecker(model_manager, performance_monitor)
        
        logger.info("All services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    
    yield
    
    # Cleanup
    logger.info("Shutting down Local AI Service...")
    if model_manager:
        await model_manager.cleanup()
    logger.info("Shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="Local AI Service",
    description="AI-powered code generation and analysis for CLI Tool",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class CodeGenerationRequest(BaseModel):
    model_name: str = Field(..., description="Name of the AI model to use")
    prompt: str = Field(..., description="Natural language prompt for code generation")
    language: Optional[str] = Field(None, description="Target programming language")
    max_length: Optional[int] = Field(512, description="Maximum length of generated code")
    temperature: Optional[float] = Field(0.7, description="Creativity temperature (0.0-1.0)")

class CodeGenerationResponse(BaseModel):
    generated_code: str
    model_used: str
    processing_time: float
    tokens_used: int
    confidence: float

class CodeAnalysisRequest(BaseModel):
    model_name: str = Field(..., description="Name of the AI model to use")
    code: str = Field(..., description="Code to analyze")
    language: Optional[str] = Field(None, description="Programming language of the code")

class CodeAnalysisResponse(BaseModel):
    analysis: Dict
    model_used: str
    processing_time: float
    suggestions: List[Dict]

class ModelInfo(BaseModel):
    id: str
    name: str
    description: str
    size: str
    status: str
    capabilities: List[str]
    is_loaded: bool

class ModelDownloadRequest(BaseModel):
    model_id: str
    force: bool = False

class ModelLoadRequest(BaseModel):
    model_id: str
    device: Optional[str] = "auto"

class HealthResponse(BaseModel):
    status: str
    models_healthy: int
    total_models: int
    system_resources: Dict
    uptime: float

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Local AI Service is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Comprehensive health check"""
    if not health_checker:
        raise HTTPException(status_code=500, detail="Health checker not initialized")
    
    return await health_checker.check_health()

@app.get("/models", response_model=List[ModelInfo])
async def list_models():
    """List all available models"""
    if not model_manager:
        raise HTTPException(status_code=500, detail="Model manager not initialized")
    
    return await model_manager.list_models()

@app.post("/models/download")
async def download_model(request: ModelDownloadRequest, background_tasks: BackgroundTasks):
    """Download a model"""
    if not model_manager:
        raise HTTPException(status_code=500, detail="Model manager not initialized")
    
    try:
        success = await model_manager.download_model(request.model_id, request.force)
        if success:
            return {"message": f"Model {request.model_id} download started"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to download model {request.model_id}")
    except Exception as e:
        logger.error(f"Error downloading model {request.model_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/models/load")
async def load_model(request: ModelLoadRequest):
    """Load a model into memory"""
    if not model_manager:
        raise HTTPException(status_code=500, detail="Model manager not initialized")
    
    try:
        success = await model_manager.load_model(request.model_id, request.device)
        if success:
            return {"message": f"Model {request.model_id} loaded successfully"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to load model {request.model_id}")
    except Exception as e:
        logger.error(f"Error loading model {request.model_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/models/unload")
async def unload_model(model_id: str):
    """Unload a model from memory"""
    if not model_manager:
        raise HTTPException(status_code=500, detail="Model manager not initialized")
    
    try:
        success = await model_manager.unload_model(model_id)
        if success:
            return {"message": f"Model {model_id} unloaded successfully"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to unload model {model_id}")
    except Exception as e:
        logger.error(f"Error unloading model {model_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate", response_model=CodeGenerationResponse)
async def generate_code(request: CodeGenerationRequest):
    """Generate code using AI models"""
    if not code_generator:
        raise HTTPException(status_code=500, detail="Code generator not initialized")
    
    try:
        result = await code_generator.generate_code(
            model_name=request.model_name,
            prompt=request.prompt,
            language=request.language,
            max_length=request.max_length,
            temperature=request.temperature
        )
        return result
    except Exception as e:
        logger.error(f"Error generating code: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """Analyze code using AI models"""
    if not code_analyzer:
        raise HTTPException(status_code=500, detail="Code analyzer not initialized")
    
    try:
        result = await code_analyzer.analyze_code(
            model_name=request.model_name,
            code=request.code,
            language=request.language
        )
        return result
    except Exception as e:
        logger.error(f"Error analyzing code: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/performance")
async def get_performance_metrics():
    """Get performance metrics"""
    if not performance_monitor:
        raise HTTPException(status_code=500, detail="Performance monitor not initialized")
    
    return await performance_monitor.get_metrics()

@app.get("/system/resources")
async def get_system_resources():
    """Get system resource usage"""
    if not performance_monitor:
        raise HTTPException(status_code=500, detail="Performance monitor not initialized")
    
    return await performance_monitor.get_system_resources()

if __name__ == "__main__":
    # Configuration
    HOST = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
    PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))
    WORKERS = int(os.getenv("AI_SERVICE_WORKERS", "1"))
    
    logger.info(f"Starting Local AI Service on {HOST}:{PORT}")
    
    # Run the server
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        workers=WORKERS,
        reload=False,
        log_level="info"
    )
