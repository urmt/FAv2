/**
 * Documentation component for comprehensive help and guides
 * Provides structured documentation, tutorials, and setup guides
 */

import { useState } from 'react'
import { BookOpen, FileText, Settings, Download, Upload, Search, ChevronRight, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { optimizationService } from '@/services/optimizationService'

interface DocumentationSection {
  id: string
  title: string
  description: string
  content: string
  category: 'getting-started' | 'user-guide' | 'api-reference' | 'troubleshooting' | 'advanced'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedReadTime: number
}

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeSection, setActiveSection] = useState<string>('getting-started')

  // Documentation sections
  const sections: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide and basic setup instructions',
      content: `
# Getting Started with Local CLI Tool

Welcome to the Local CLI Tool! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 16.0 or higher
- Python 3.8 or higher (for AI features)
- Git for version control
- 8GB RAM minimum (16GB recommended)

## Installation

### Basic Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

### Full Installation with AI Features
\`\`\`bash
# Clone and setup
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool
npm install

# Setup AI service
cd local-ai-service
python3 -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python main.py &

# Return and start web interface
cd ..
npm run dev
\`\`\`

## First Steps

1. **Open the Web Interface**: Navigate to http://localhost:3000
2. **Check System Status**: Review the Overview tab for system health
3. **Load AI Models**: Go to Models → Model Management to download models
4. **Run Analysis**: Try Code Analysis → Static Analysis on your project
5. **Generate Code**: Use the AI Code Generator with natural language prompts

## Next Steps

- Explore different modules and features
- Configure settings to match your workflow
- Train custom models with your datasets
- Install plugins for extended functionality
      `,
      category: 'getting-started',
      difficulty: 'beginner',
      estimatedReadTime: 10
    },
    {
      id: 'user-guide',
      title: 'User Guide',
      description: 'Comprehensive guide to all features and functionality',
      content: `
# User Guide

This comprehensive guide covers all features of the Local CLI Tool.

## Code Analysis

### Static Code Analysis
The Code Analysis module provides comprehensive static analysis for your codebase:

**Features:**
- Multi-language support (JavaScript, Python, TypeScript, React, Bash, HTML)
- Real-time linting and error detection
- Automated refactoring suggestions
- Code quality metrics and scoring

**Usage:**
1. Navigate to Code Analysis → Static Analysis
2. Select your project directory
3. Click "Start Analysis"
4. Review results and apply suggestions

### Code Enhancement
Beyond basic analysis, the tool offers advanced enhancement features:

- **Automated Refactoring**: Apply best practices and design patterns
- **Documentation Generation**: Auto-generate documentation from code comments
- **Security Analysis**: Detect potential security vulnerabilities
- **Performance Analysis**: Identify performance bottlenecks

## System Management

### System Monitoring
Monitor your system resources in real-time:

**Metrics Tracked:**
- CPU usage and temperature
- Memory usage and allocation
- Disk space and I/O operations
- Network traffic and latency

**Features:**
- Real-time graphs and charts
- Historical data tracking
- Alert system for critical issues
- Resource optimization recommendations

### Process Management
Manage system processes effectively:

- View all running processes
- Monitor resource usage per process
- Start, stop, and restart processes
- Process priority management

## AI-Powered Features

### Model Management
Download, load, and manage AI models:

**Available Models:**
- CodeBERT Small (500MB, CPU-friendly)
- DistilGPT2 Code (350MB, balanced)
- TinyLLaMA (2.2GB, capable)
- StarCoder Base (15GB, enterprise)

**Operations:**
- Download models from Hugging Face
- Load models into memory
- Configure quantization settings
- Monitor model performance

### Code Generation
Generate code from natural language descriptions:

**Features:**
- Multi-language support
- Template-based generation
- AI-powered suggestions
- Code quality scoring

**Usage:**
1. Go to Generate → AI Code Generator
2. Select target programming language
3. Describe what you want to create
4. Review and refine generated code

### Model Training
Train custom models with your datasets:

**Training Interface:**
- Dataset management and preparation
- Training parameter configuration
- Real-time progress monitoring
- Model evaluation and testing

**Best Practices:**
- Use high-quality, diverse datasets
- Start with smaller models for testing
- Monitor training metrics closely
- Validate models thoroughly

## Plugin System

### Available Plugins
Extend functionality with community plugins:

**Popular Plugins:**
- Python Linter: Advanced Python code analysis
- System Monitor: Real-time system metrics
- Security Scanner: Vulnerability detection
- Git Integration: Repository management

### Plugin Development
Create your own plugins:

**Development Guide:**
- Plugin structure and API
- Event handling and integration
- UI components and configuration
- Testing and deployment

## Configuration

### System Configuration
Configure system-wide settings:

**Settings:**
- Resource limits and allocation
- Performance optimization options
- Logging and monitoring preferences
- Security and access controls

### AI Configuration
Configure AI model behavior:

**Parameters:**
- Default model selection
- Generation parameters (temperature, tokens)
- Caching and optimization settings
- Quantization and precision options

## Best Practices

### Development Workflow
1. **Regular Analysis**: Analyze code frequently for quality
2. **System Monitoring**: Keep an eye on system resources
3. **AI Assistance**: Use AI for repetitive and complex tasks
4. **Model Training**: Continuously improve with new data
5. **Plugin Development**: Extend functionality as needed

### Security Practices
- **Local Processing**: All operations run locally
- **Model Validation**: Verify model integrity
- **Access Control**: Configure appropriate permissions
- **Data Protection**: Sensitive code stays on your machine

### Performance Optimization
- **Resource Management**: Monitor and optimize resource usage
- **Model Selection**: Choose appropriate models for your hardware
- **Caching**: Enable caching for repeated operations
- **Background Processing**: Run heavy tasks in background

## Troubleshooting

### Common Issues
- **Build Errors**: Clear cache and reinstall dependencies
- **AI Service Issues**: Check Python environment and dependencies
- **Performance Problems**: Monitor resources and adjust settings
- **Model Loading**: Verify disk space and model integrity

### Getting Help
- **Built-in Help**: Use --help flag for command assistance
- **Documentation**: Comprehensive guides and references
- **Community**: GitHub issues and discussions
- **Support**: Dedicated support channels

## Advanced Features

### Advanced Configuration
- **Custom Profiles**: Create configuration profiles for different use cases
- **Environment Variables**: Configure settings via environment variables
- **Import/Export**: Save and load configuration profiles

### Performance Optimization
- **Benchmarking**: Run system performance benchmarks
- **Optimization Profiles**: Use pre-configured optimization settings
- **Resource Tuning**: Fine-tune resource allocation and usage

### Integration and Automation
- **API Integration**: Integrate with external tools and services
- **CI/CD Integration**: Use in automated workflows
- **Scripting**: Automate repetitive tasks and workflows

## Conclusion

The Local CLI Tool provides a comprehensive solution for local development with AI-powered features. By following this guide, you can effectively use all features and optimize your development workflow.

Remember to:
- Keep your system and models updated
- Monitor performance and resources
- Use appropriate settings for your use case
- Leverage the community for support and improvements
      `,
      category: 'user-guide',
      difficulty: 'intermediate',
      estimatedReadTime: 25
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation for developers and integrators',
      content: `
# API Reference

This document provides complete API documentation for the Local CLI Tool, including web interface APIs, local AI service APIs, and plugin development APIs.

## Web Interface API

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Authentication
All API requests require authentication using Bearer tokens:

\`\`\`
Authorization: Bearer <your-api-key>
\`\`\`

### Endpoints

#### System Management
\`\`\`
GET /api/system/metrics
\`\`\`
Get current system metrics.

**Response:**
\`\`\`json
{
  "cpu": {
    "usage": 35.2,
    "cores": 8,
    "temperature": 45.0
  },
  "memory": {
    "total": 16384,
    "used": 11264,
    "available": 5120,
    "percentage": 68.7
  },
  "disk": {
    "total": 524288,
    "used": 409600,
    "available": 114688,
    "percentage": 78.1
  },
  "network": {
    "download": 12.5,
    "upload": 5.2,
    "latency": 15.0
  }
}
\`\`\`

\`\`\`
GET /api/system/processes
\`\`\`
Get list of running processes.

**Response:**
\`\`\`json
{
  "processes": [
    {
      "pid": 1234,
      "name": "node",
      "cpu": 15.2,
      "memory": 256,
      "status": "running",
      "user": "developer",
      "startTime": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

#### Code Analysis
\`\`\`
POST /api/code/analyze
\`\`\`
Analyze code for quality and issues.

**Request Body:**
\`\`\`json
{
  "projectPath": "/path/to/project",
  "language": "javascript",
  "includeTests": true,
  "severity": "all"
}
\`\`\`

**Response:**
\`\`\`json
{
  "results": [
    {
      "file": "src/components/App.js",
      "issues": [
        {
          "type": "error",
          "message": "Unused variable 'unusedVar'",
          "line": 45,
          "column": 12,
          "severity": "low"
        }
      ],
      "metrics": {
        "complexity": 7.2,
        "maintainability": 82,
        "linesOfCode": 156
      }
    }
  ]
}
\`\`\`

#### Code Generation
\`\`\`
POST /api/code/generate
\`\`\`
Generate code from natural language description.

**Request Body:**
\`\`\`json
{
  "prompt": "Create a Python function to fetch API data",
  "language": "python",
  "maxTokens": 512,
  "temperature": 0.7
}
\`\`\`

**Response:**
\`\`\`json
{
  "generatedCode": "def fetch_api_data(url):\\n    import requests\\n    try:\\n        response = requests.get(url)\\n        response.raise_for_status()\\n        return response.json()\\n    except requests.RequestException as e:\\n        print(f\"Error fetching data: {e}\")\\n        return None",
  "modelUsed": "codebert-small",
  "processingTime": 1250,
  "confidence": 0.85
}
\`\`\`

## Local AI Service API

### Base URL
\`\`\`
http://localhost:8000
\`\`\`

### Model Management
\`\`\`
GET /models
\`\`\`
Get list of available models.

**Response:**
\`\`\`json
{
  "models": [
    {
      "id": "codebert-small",
      "name": "CodeBERT Small",
      "description": "Lightweight code understanding model",
      "size": "500MB",
      "status": "available"
    }
  ]
}
\`\`\`

\`\`\`
POST /models/download
\`\`\`
Download a model.

**Request Body:**
\`\`\`json
{
  "modelId": "codebert-small",
  "force": false
}
\`\`\`

\`\`\`
POST /models/load
\`\`\`
Load a model into memory.

**Request Body:**
\`\`\`json
{
  "modelId": "codebert-small",
  "device": "auto"
}
\`\`\`

### Code Generation
\`\`\`
POST /generate
\`\`\`
Generate code using loaded models.

**Request Body:**
\`\`\`json
{
  "modelName": "codebert-small",
  "prompt": "def fibonacci(n):",
  "language": "python",
  "maxLength": 200,
  "temperature": 0.7
}
\`\`\`

**Response:**
\`\`\`json
{
  "generatedCode": "def fibonacci(n):\\n    if n <= 1:\\n        return n\\n    else:\\n        return fibonacci(n-1) + fibonacci(n-2)",
  "modelUsed": "codebert-small",
  "processingTime": 850,
  "tokensUsed": 150,
  "confidence": 0.92
}
\`\`\`

### Code Analysis
\`\`\`
POST /analyze
\`\`\`
Analyze code using AI models.

**Request Body:**
\`\`\`json
{
  "modelName": "codebert-small",
  "code": "def hello_world():\\n    print('Hello, World!')",
  "language": "python"
}
\`\`\`

**Response:**
\`\`\`json
{
  "analysis": {
    "basicMetrics": {
      "linesOfCode": 2,
      "complexity": 1,
      "maintainability": 95
    },
    "suggestions": [
      {
        "type": "documentation",
        "description": "Add docstring to function",
        "priority": "medium",
        "confidence": 0.8
      }
    ]
  },
  "modelUsed": "codebert-small",
  "processingTime": 1200
}
\`\`\`

## Plugin Development API

### Plugin Structure
Plugins must implement the following interface:

\`\`\`typescript
interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  dependencies?: string[]
  
  // Plugin lifecycle
  init(api: PluginAPI): Promise<void>
  destroy(): Promise<void>
  
  // Plugin functionality
  execute(context: PluginContext): Promise<PluginResult>
}
\`\`\`

### Plugin API
The Plugin API provides access to various system features:

\`\`\`typescript
interface PluginAPI {
  // System access
  getSystemMetrics(): Promise<SystemMetrics>
  getProcesses(): Promise<ProcessInfo[]>
  
  // Code analysis
  analyzeCode(code: string, language: string): Promise<AnalysisResult>
  generateCode(prompt: string, language: string): Promise<GenerationResult>
  
  // Model management
  listModels(): Promise<ModelInfo[]>
  loadModel(modelId: string): Promise<void>
  
  // Configuration
  getConfig(key: string): Promise<any>
  setConfig(key: string, value: any): Promise<void>
  
  // UI components
  registerMenuItem(item: MenuItem): void
  showDialog(options: DialogOptions): Promise<any>
}
\`\`\`

### Example Plugin
\`\`\`typescript
class MyPlugin implements Plugin {
  id = 'my-plugin'
  name = 'My Plugin'
  version = '1.0.0'
  description = 'Example plugin for demonstration'
  author = 'Developer Name'

  async init(api: PluginAPI) {
    // Initialize plugin
    this.api = api
    
    // Register menu item
    this.api.registerMenuItem({
      id: 'my-plugin-action',
      label: 'My Plugin Action',
      icon: 'star',
      handler: this.handleAction.bind(this)
    })
  }

  async destroy() {
    // Cleanup plugin resources
  }

  async execute(context: PluginContext) {
    // Execute plugin logic
    return {
      success: true,
      message: 'Plugin executed successfully'
    }
  }

  private async handleAction() {
    // Handle menu item click
    const result = await this.api.showDialog({
      title: 'My Plugin',
      message: 'Enter your input:',
      input: true
    })
    
    // Process result
    console.log('Plugin action result:', result)
  }
}
\`\`\`

## Error Handling

### Error Response Format
All API endpoints return errors in a consistent format:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "MODEL_NOT_FOUND",
    "message": "Model 'unknown-model' not found",
    "details": "Available models: codebert-small, distilgpt2-code"
  }
}
\`\`\`

### Error Codes
| Code | Description |
|------|-------------|
| MODEL_NOT_FOUND | Requested model is not available |
| MODEL_LOADING | Model is currently being loaded |
| INSUFFICIENT_RESOURCES | Not enough system resources |
| INVALID_REQUEST | Request parameters are invalid |
| AUTHENTICATION_FAILED | Authentication token is invalid |
| PERMISSION_DENIED | Insufficient permissions for operation |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Web Interface API**: 100 requests per minute
- **AI Service API**: 50 requests per minute
- **Plugin API**: 200 requests per minute

Rate limit headers are included in responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`

## Webhooks

### Code Analysis Webhook
Subscribe to code analysis events:

\`\`\`
POST /api/webhooks/code-analysis
\`\`\`

**Request Body:**
\`\`\`json
{
  "url": "https://your-webhook-url.com/analysis",
  "events": ["analysis_completed", "issue_found"],
  "secret": "your-webhook-secret"
}
\`\`\`

**Webhook Payload:**
\`\`\`json
{
  "event": "analysis_completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "projectId": "my-project",
    "filesAnalyzed": 24,
    "issuesFound": 5,
    "analysisTime": 2500
  }
}
\`\`\`

## SDK and Libraries

### JavaScript SDK
\`\`\`bash
npm install @local-cli-tool/sdk
\`\`\`

\`\`\`javascript
import { LocalCLITool } from '@local-cli-tool/sdk'

const cli = new LocalCLITool({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key'
})

// Analyze code
const analysis = await cli.analyzeCode({
  projectPath: './src',
  language: 'javascript'
})

// Generate code
const generated = await cli.generateCode({
  prompt: 'Create a React component',
  language: 'javascript'
})
\`\`\`

### Python SDK
\`\`\`bash
pip install local-cli-tool-sdk
\`\`\`

\`\`\`python
from local_cli_tool import LocalCLITool

cli = LocalCLITool(
    base_url='http://localhost:8000',
    api_key='your-api-key'
)

# Generate code
result = cli.generate_code(
    model_name='codebert-small',
    prompt='def fibonacci(n):',
    language='python'
)
\`\`\`

## Testing

### API Testing
Use curl or Postman to test API endpoints:

\`\`\`bash
# Test system metrics
curl -H "Authorization: Bearer your-api-key" \\
     http://localhost:3000/api/system/metrics

# Test code generation
curl -X POST \\
     -H "Authorization: Bearer your-api-key" \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "Hello World", "language": "python"}' \\
     http://localhost:3000/api/code/generate
\`\`\`

### Integration Testing
Test your integration with the SDK:

\`\`\`javascript
// Test with mock data
const mockApi = {
  getSystemMetrics: () => Promise.resolve(mockMetrics),
  generateCode: () => Promise.resolve(mockGeneratedCode)
}

const cli = new LocalCLITool({ api: mockApi })
\`\`\`

## Version Compatibility

### API Versioning
The API uses semantic versioning. Include the version in requests:

\`\`\`
Accept: application/vnd.local-cli-tool.v2+json
\`\`\`

### Backward Compatibility
- **v1.x**: Current stable version
- **v2.x**: Beta features (may change)
- **v3.x**: Development version (unstable)

## Security Considerations

### Authentication
- Use Bearer tokens for API authentication
- Rotate tokens regularly
- Store tokens securely
- Use HTTPS in production

### Data Protection
- All processing happens locally
- Sensitive code never leaves the system
- Models are downloaded from trusted sources
- Regular security updates and patches

### Rate Limiting
- Implement client-side rate limiting
- Handle rate limit exceeded errors gracefully
- Use exponential backoff for retries

## Conclusion

This API reference provides comprehensive documentation for integrating with the Local CLI Tool. The API is designed to be intuitive, secure, and extensible, supporting a wide range of use cases from basic code analysis to advanced AI model training.

For additional support:
- Check the troubleshooting section
- Review the example implementations
- Join the community discussions
- Contact the development team
      `,
      category: 'api-reference',
      difficulty: 'advanced',
      estimatedReadTime: 35
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and solutions for the Local CLI Tool',
      content: `
# Troubleshooting Guide

This guide covers common issues and their solutions for the Local CLI Tool.

## Installation Issues

### Node.js Installation Problems

**Issue:** Node.js installation fails or version conflicts

**Solutions:**
\`\`\`bash
# Remove existing Node.js installation
sudo apt remove nodejs npm
sudo apt autoremove

# Install Node.js 18 using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
\`\`\`

**Issue:** Permission denied during installation

**Solutions:**
\`\`\`bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm for user-level installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
\`\`\`

### Python Environment Issues

**Issue:** Python virtual environment problems

**Solutions:**
\`\`\`bash
# Create clean virtual environment
python3 -m venv venv --clear
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
\`\`\`

**Issue:** Missing Python dependencies

**Solutions:**
\`\`\`bash
# Check for missing packages
pip check

# Install missing dependencies individually
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install transformers accelerate bitsandbytes
\`\`\`

## Build and Runtime Issues

### Build Failures

**Issue:** Build fails with TypeScript errors

**Solutions:**
\`\`\`bash
# Clear build cache
rm -rf .next build dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build
\`\`\`

**Issue:** Module not found errors

**Solutions:**
\`\`\`bash
# Check for missing modules
npm list --depth=0

# Install missing modules
npm install missing-module-name

# Check for circular dependencies
npm ls --depth=0 | grep -v "UNMET"
\`\`\`

### Runtime Errors

**Issue:** Application crashes on startup

**Solutions:**
\`\`\`bash
# Check Node.js version
node --version

# Check for port conflicts
lsof -i :3000

# Run in development mode for better error messages
npm run dev
\`\`\`

**Issue:** Memory allocation errors

**Solutions:**
\`\`\`bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Check system memory
free -h
htop

# Close memory-intensive applications
\`\`\`

## AI Service Issues

### Model Download Failures

**Issue:** Model download fails or times out

**Solutions:**
\`\`\`bash
# Check disk space
df -h

# Check internet connection
ping huggingface.co

# Increase timeout for large models
export HF_HUB_TIMEOUT=300

# Try downloading a smaller model first
curl -X POST "http://localhost:8000/models/codebert-small/download"
\`\`\`

**Issue:** Model loading fails

**Solutions:**
\`\`\`bash
# Check available memory
free -h

# Check GPU memory (if available)
nvidia-smi

# Try loading with CPU only
curl -X POST "http://localhost:8000/models/load" \\
     -H "Content-Type: application/json" \\
     -d '{"modelId": "codebert-small", "device": "cpu"}'
\`\`\`

### AI Service Performance Issues

**Issue:** Slow response times

**Solutions:**
\`\`\`bash
# Check system resources
top
htop

# Enable GPU acceleration if available
# Update model settings to use GPU

# Use quantized models for faster inference
curl -X POST "http://localhost:8000/models/load" \\
     -H "Content-Type: application/json" \\
     -d '{"modelId": "codebert-small", "quantization": "4bit"}'
\`\`\`

## System Resource Issues

### High CPU Usage

**Issue:** CPU usage consistently above 80%

**Solutions:**
\`\`\`bash
# Identify CPU-intensive processes
top -o %CPU

# Check for background processes
ps aux --sort=-%cpu | head -10

# Close unnecessary applications
kill -9 <process-id>

# Adjust model settings for lower CPU usage
# Reduce batch size or use smaller models
\`\`\`

### High Memory Usage

**Issue:** Memory usage exceeding available RAM

**Solutions:**
\`\`\`bash
# Check memory usage
free -h
htop

# Identify memory-intensive processes
ps aux --sort=-%mem | head -10

# Clear system cache
sudo sync && sudo echo 3 > /proc/sys/vm/drop_caches

# Use memory-optimized models
# Enable quantization in model settings
\`\`\`

### Disk Space Issues

**Issue:** Insufficient disk space for models

**Solutions:**
\`\`\`bash
# Check disk usage
df -h
du -sh ~/.cache/huggingface

# Clear model cache
rm -rf ~/.cache/huggingface/hub

# Clean system temporary files
sudo apt-get clean
sudo apt-get autoremove

# Use external storage for models
# Create symlink to external drive
\`\`\`

## Configuration Issues

### Environment Variables

**Issue:** Environment variables not loading

**Solutions:**
\`\`\`bash
# Check if .env file exists
ls -la .env

# Create .env file if missing
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_API_KEY=your-api-key-here
VITE_ENABLE_AI_GENERATION=true
EOF

# Load environment variables in current session
export $(cat .env | xargs)
\`\`\`

### Configuration File Errors

**Issue:** Invalid configuration format

**Solutions:**
\`\`\`bash
# Validate JSON configuration
cat config.json | python -m json.tool

# Fix syntax errors
# Use a text editor with JSON validation

# Reset to default configuration
mv config.json config.json.backup
cp config.default.json config.json
\`\`\`

## Plugin Issues

### Plugin Installation Failures

**Issue:** Plugin cannot be installed or loaded

**Solutions:**
\`\`\`bash
# Check plugin compatibility
npm list | grep plugin-name

# Check for dependency conflicts
npm ls

# Install plugin with verbose output
npm install plugin-name@version --verbose

# Clear plugin cache
rm -rf ~/.local/share/plugin-cache
\`\`\`

### Plugin Runtime Errors

**Issue:** Plugin crashes or causes application instability

**Solutions:**
\`\`\`bash
# Check plugin logs
tail -f logs/plugin-errors.log

# Disable problematic plugin
# Update plugin configuration

# Reinstall plugin
npm uninstall plugin-name
npm install plugin-name
\`\`\`

## Network Issues

### Connection Problems

**Issue:** Cannot connect to AI service

**Solutions:**
\`\`\`bash
# Check if AI service is running
ps aux | grep "python main.py"

# Check service logs
tail -f local-ai-service/ai_service.log

# Restart AI service
pkill -f "python main.py"
python main.py &

# Check port conflicts
netstat -tlnp | grep :8000
\`\`\`

### Firewall Issues

**Issue:** Firewall blocking connections

**Solutions:**
\`\`\`bash
# Check firewall status
sudo ufw status

# Allow required ports
sudo ufw allow 3000
sudo ufw allow 8000

# Disable firewall for testing
sudo ufw disable
\`\`\`

## Performance Issues

### Slow Response Times

**Issue:** Application responds slowly

**Solutions:**
\`\`\`bash
# Check system resources
top
htop

# Monitor network latency
ping localhost

# Enable performance monitoring
# Use browser developer tools to analyze performance

# Optimize model settings
# Use caching and quantization
\`\`\`

### Memory Leaks

**Issue:** Memory usage increases over time

**Solutions:**
\`\`\`bash
# Monitor memory usage
watch -n 1 free -h

# Check for memory leaks
valgrind --leak-check=full node server.js

# Restart application periodically
# Implement automatic cleanup procedures

# Use memory-efficient models and settings
\`\`\`

## Browser Issues

### Browser Compatibility

**Issue:** Application not working in specific browsers

**Solutions:**
\`\`\`
# Check browser console for errors
# Enable developer tools

# Try different browsers
# Chrome, Firefox, Safari, Edge

# Update browser to latest version
# Clear browser cache and cookies

# Disable browser extensions temporarily
\`\`\`

### Display Issues

**Issue:** UI not rendering correctly

**Solutions:**
\`\`\`bash
# Check browser zoom level
# Reset browser zoom

# Clear browser cache
# Hard refresh (Ctrl+Shift+R)

# Check for CSS conflicts
# Use browser inspector to debug

# Test in different screen resolutions
# Ensure responsive design is working
\`\`\`

## Getting Help

### Built-in Help

**Application Help:**
\`\`\`bash
# Access help from CLI
./cli-tool --help
./cli-tool --help [command]

# View logs
./cli-tool logs
\`\`\`

**Web Interface Help:**
- Navigate to Help → Documentation
- Use the search function to find specific topics
- Check the troubleshooting section for common issues

### Community Support

**GitHub Issues:**
- Report bugs and request features
- Search existing issues before creating new ones
- Provide detailed information and reproduction steps

**Discord Community:**
- Join our Discord server for real-time support
- Discuss with other users and developers
- Share your experience and solutions

### Professional Support

**Enterprise Support:**
- Contact our support team for enterprise solutions
- Schedule a consultation for complex issues
- Get priority support and custom solutions

## Debug Mode

### Enable Debug Logging

**Application Debug Mode:**
\`\`\`bash
# Enable debug logging
export DEBUG=local-cli-tool:*
npm run dev
\`\`\`

**AI Service Debug Mode:**
\`\`\`bash
# Enable debug logging for AI service
export PYTHONPATH=/path/to/local-ai-service
python main.py --debug
\`\`\`

### Debug Information Collection

**System Information:**
\`\`\`bash
# Collect system information
uname -a
lscpu
free -h
df -h
nvidia-smi  # if available
\`\`\`

**Application Logs:**
\`\`\`bash
# Collect application logs
tail -f logs/app.log
tail -f logs/error.log
tail -f local-ai-service/ai_service.log
\`\`\`

**Network Traffic:**
\`\`\`bash
# Monitor network traffic
tcpdump -i lo port 3000
tcpdump -i lo port 8000
\`\`\`

## Common Error Messages

### Build Errors
\`\`\`
Error: Cannot find module 'react'
\`\`\`
**Solution:** Install missing dependencies with \`npm install\`

\`\`\`
Error: SyntaxError: Unexpected token
\`\`\`
**Solution:** Check for syntax errors in your code files

\`\`\`
Error: Module not found: 'module-name'
\`\`\`
**Solution:** Install the missing module or check import paths

### Runtime Errors
\`\`\`
Error: EADDRINUSE: Address already in use
\`\`\`
**Solution:** Change port or kill process using the port

\`\`\`
Error: ENOSPC: No space left on device
\`\`\`
**Solution:** Free up disk space or use external storage

\`\`\`
Error: ECONNREFUSED: Connection refused
\`\`\`
**Solution:** Ensure the service is running and check firewall settings

### AI Service Errors
\`\`\`
Error: Model not found
\`\`\`
**Solution:** Download the model first or check model name

\`\`\`
Error: Insufficient GPU memory
\`\`\`
**Solution:** Use CPU mode or smaller model

\`\`\`
Error: Timeout during model loading
\`\`\`
**Solution:** Increase timeout or check network connection

## Best Practices

### Prevention

**Regular Updates:**
- Keep the application and dependencies updated
- Regularly update AI models and plugins
- Monitor security patches and updates

**Resource Management:**
- Monitor system resources regularly
- Set up alerts for critical resource usage
- Implement automatic cleanup procedures

**Backup and Recovery:**
- Regularly backup configuration and data
- Maintain backup of AI models and datasets
- Test recovery procedures regularly

### Monitoring

**Performance Monitoring:**
- Use built-in performance monitoring tools
- Set up regular performance benchmarks
- Monitor response times and resource usage

**Error Monitoring:**
- Implement comprehensive error logging
- Set up alerts for critical errors
- Regularly review error logs and patterns

### Maintenance

**Regular Maintenance:**
- Clean up temporary files and cache
- Update dependencies and security patches
- Rotate logs and manage storage

**Testing:**
- Regular testing of all features and functionality
- Performance testing under various load conditions
- Security testing and vulnerability scanning

## Conclusion

This troubleshooting guide covers the most common issues you may encounter while using the Local CLI Tool. By following these solutions and best practices, you can resolve most problems quickly and effectively.

Remember to:
- Keep your system and application updated
- Monitor resources and performance regularly
- Use appropriate settings for your hardware
- Leverage community support and documentation
- Implement preventive measures to avoid future issues

For additional support:
- Check the comprehensive documentation
- Join community discussions
- Contact the development team
- Report bugs and request features

Happy coding with the Local CLI Tool! 🚀
      `,
      category: 'troubleshooting',
      difficulty: 'intermediate',
      estimatedReadTime: 20
    }
  ]

  // Filter sections based on search and category
  const filteredSections = sections.filter(section => {
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', name: 'All Categories', count: sections.length },
    { id: 'getting-started', name: 'Getting Started', count: sections.filter(s => s.category === 'getting-started').length },
    { id: 'user-guide', name: 'User Guide', count: sections.filter(s => s.category === 'user-guide').length },
    { id: 'api-reference', name: 'API Reference', count: sections.filter(s => s.category === 'api-reference').length },
    { id: 'troubleshooting', name: 'Troubleshooting', count: sections.filter(s => s.category === 'troubleshooting').length },
    { id: 'advanced', name: 'Advanced', count: sections.filter(s => s.category === 'advanced').length }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <BookOpen className="h-4 w-4" />
      case 'user-guide': return <FileText className="h-4 w-4" />
      case 'api-reference': return <Settings className="h-4 w-4" />
      case 'troubleshooting': return <AlertTriangle className="h-4 w-4" />
      case 'advanced': return <Settings className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const formatReadTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Documentation</h2>
            <p className="text-slate-400">Comprehensive guides, API reference, and troubleshooting</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-transparent border-slate-600">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="bg-transparent border-slate-600">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Online
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 rounded-lg border transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {getCategoryIcon(category.id)}
                  <span>{category.name}</span>
                  <Badge variant="outline" className="text-xs border-slate-600">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <Card key={section.id} className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center">
                    {getCategoryIcon(section.category)}
                    <span className="ml-2">{section.title}</span>
                    <Badge className={`ml-2 ${getDifficultyColor(section.difficulty)}`}>
                      {section.difficulty}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    {section.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatReadTime(section.estimatedReadTime)}</span>
                  </div>
                  <Badge variant="outline" className="border-slate-600">
                    {section.category.replace('-', ' ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose prose-invert max-w-none">
                <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                    {section.content}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSections.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No documentation found</h3>
              <p className="text-slate-400">
                Try adjusting your search terms or browse different categories.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Common tasks and helpful resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
              <FileText className="h-6 w-6 mb-2" />
              User Guide
            </Button>
            <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
              <Settings className="h-6 w-6 mb-2" />
              API Reference
            </Button>
            <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
              <AlertTriangle className="h-6 w-6 mb-2" />
              Troubleshooting
            </Button>
            <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
              <Download className="h-6 w-6 mb-2" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Recommendations */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            System Recommendations
          </CardTitle>
          <CardDescription className="text-slate-400">
            Based on your system configuration and usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Optimal Configuration Detected</h4>
                <p className="text-sm text-slate-400">
                  Your system is well-configured for the Local CLI Tool. Consider using the "balanced" profile for optimal performance.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">GPU Available for AI Acceleration</h4>
                <p className="text-sm text-slate-400">
                  NVIDIA GPU detected. Enable GPU acceleration in model settings for significantly faster processing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Memory Optimization Available</h4>
                <p className="text-sm text-slate-400">
                  Use 4-bit quantization for AI models to reduce memory usage by up to 75% while maintaining good performance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
