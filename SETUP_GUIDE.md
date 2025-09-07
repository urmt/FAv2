# Local CLI Tool - Complete Setup Guide

## 🚀 **Quick Start Guide**

This guide will help you set up and run the Local CLI Tool with all its features including local AI models, code analysis, and system management.

### **📋 Prerequisites**

#### **System Requirements**
- **CPU**: 4-core processor (Intel i5 / AMD Ryzen 5 or better)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free space (SSD recommended)
- **GPU**: Optional (NVIDIA GPU with 6GB+ VRAM for AI features)
- **OS**: Linux (Ubuntu 20.04+, Fedora 35+), macOS 10.15+, or Windows 10+ (with WSL2)

#### **Software Requirements**
- **Node.js**: Version 16.0 or higher
- **Python**: Version 3.8 or higher
- **Git**: For version control
- **Docker**: Optional (for containerized deployment)

### **🛠️ Installation Instructions**

#### **Option 1: Basic Installation (Web Interface Only)**
```bash
# Clone the repository
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser and navigate to http://localhost:3000
```

#### **Option 2: Full Installation with Local AI**
```bash
# Clone the repository
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool

# Install web interface dependencies
npm install

# Setup local AI service
cd local-ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# Start the local AI service (in a separate terminal)
python main.py

# Return to project root and start web interface
cd ..
npm run dev

# Open your browser and navigate to http://localhost:3000
```

#### **Option 3: Production Deployment**
```bash
# Build the web interface
npm run build

# Start production server
npm start

# Setup local AI service as a system service (see docs/LOCAL_AI_SETUP.md)
```

### **🤖 Local AI Setup**

#### **Downloading Models**
```bash
# Start the AI service (if not already running)
cd local-ai-service
python main.py &

# Download lightweight models (CPU-friendly)
curl -X POST "http://localhost:8000/models/codebert-small/download"
curl -X POST "http://localhost:8000/models/distilgpt2-code/download"

# For GPU users, download larger models
curl -X POST "http://localhost:8000/models/tinyllama/download"
```

#### **Loading Models**
```bash
# Load models into memory
curl -X POST "http://localhost:8000/models/codebert-small/load"
curl -X POST "http://localhost:8000/models/distilgpt2-code/load"
```

#### **Testing the AI Service**
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
    "code": "def hello_world():\\n    print(\\\"Hello, World!\\\")"
  }'
```

### **🎯 First Steps**

#### **1. System Overview**
- Open the web interface at `http://localhost:3000`
- Navigate to the **Overview** tab to see system status and quick actions
- Check the system metrics and ensure all services are running

#### **2. Code Analysis**
- Navigate to **Code Analysis** → **Static Analysis**
- Click "Start Analysis" to scan your codebase
- Review the results and apply refactoring suggestions

#### **3. AI-Powered Code Generation**
- Navigate to **Models** → **Model Management**
- Download and load your preferred AI models
- Go to **Generate** → **AI Code Generator**
- Select a programming language and describe what you want to create

#### **4. System Management**
- Navigate to **System** → **System Monitoring**
- Monitor CPU, memory, disk, and network usage
- Run diagnostics and troubleshoot system issues

#### **5. Model Training**
- Navigate to **Training** → **Training Jobs**
- Prepare your dataset and configure training parameters
- Start training custom AI models with your data

### **🔧 Configuration**

#### **Environment Variables**
Create a `.env` file in the root directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_AI_GENERATION=true
VITE_ENABLE_SYSTEM_MONITORING=true
VITE_ENABLE_MODEL_TRAINING=true
```

#### **Advanced Configuration**
- Navigate to **Settings** → **Advanced Configuration**
- Configure system resources, AI parameters, and performance settings
- Import/export configuration profiles for different environments

### **📚 Key Features**

#### **Code Analysis**
- **Static Analysis**: Comprehensive linting and code quality checks
- **Automated Refactoring**: AI-powered suggestions for code improvements
- **Multi-language Support**: JavaScript, Python, TypeScript, React, Bash, HTML
- **Real-time Feedback**: Instant analysis results with severity levels

#### **System Management**
- **Real-time Monitoring**: CPU, Memory, Disk, and Network usage tracking
- **Process Management**: View and manage running processes
- **System Diagnostics**: Comprehensive health checks and troubleshooting
- **Resource Optimization**: Recommendations for system performance

#### **AI-Powered Features**
- **Local Code Generation**: Generate code from natural language descriptions
- **Model Management**: Download, load, and manage AI models
- **Model Training**: Fine-tune models with custom datasets
- **Performance Optimization**: GPU acceleration and memory management

#### **Plugin System**
- **Extensible Architecture**: Modular plugin framework
- **Plugin Marketplace**: Browse and install community plugins
- **Custom Development**: API for creating custom extensions
- **Plugin Management**: Enable, disable, and configure plugins

### **🚨 Troubleshooting**

#### **Common Issues**

**Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
npm run build
```

**AI Service Not Starting**
```bash
# Check Python version
python3 --version

# Check dependencies
pip list

# Restart the service
pkill -f "python main.py"
python main.py
```

**Model Download Failures**
```bash
# Check disk space
df -h

# Check internet connection
ping huggingface.co

# Try downloading a smaller model first
curl -X POST "http://localhost:8000/models/codebert-small/download"
```

**Performance Issues**
```bash
# Monitor system resources
top
htop

# Check GPU usage (if available)
nvidia-smi

# Optimize model settings
# Navigate to Settings → Advanced Configuration → Performance
```

#### **Getting Help**

**Built-in Help**
```bash
# Access help from the CLI
./cli-tool --help
./cli-tool --help [command]

# View logs
./cli-tool logs
```

**Documentation**
- **User Guide**: `docs/USER_GUIDE.md`
- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Local AI Setup**: `docs/LOCAL_AI_SETUP.md`
- **Plugin Development**: `docs/PLUGIN_DEVELOPMENT.md`

**Community Support**
- **GitHub Issues**: Report bugs and request features
- **Discord Server**: Join community discussions
- **Stack Overflow**: Use tag `local-cli-tool`

### **📊 Performance Optimization**

#### **System Optimization**
- **Memory Management**: Configure memory limits and automatic cleanup
- **GPU Acceleration**: Enable GPU support for faster AI processing
- **CPU Optimization**: Configure thread count and process priority
- **Disk Optimization**: Use SSD storage and configure disk caching

#### **AI Model Optimization**
- **Model Selection**: Choose appropriate models for your hardware
- **Quantization**: Use 4-bit or 8-bit quantization for memory efficiency
- **Batch Processing**: Configure batch size for optimal throughput
- **Caching**: Enable result caching for repeated operations

#### **Network Optimization**
- **Local Processing**: All operations run locally for maximum privacy
- **Bandwidth Management**: Configure model download and update settings
- **Latency Optimization**: Use local models for minimal response time

### **🔄 Updates and Maintenance**

#### **Updating the Tool**
```bash
# Update the web interface
git pull origin main
npm install
npm run build

# Update AI service models
curl -X POST "http://localhost:8000/models/update"
```

#### **Maintenance Tasks**
- **Regular Updates**: Keep the tool and models up to date
- **Cache Cleanup**: Clear old cache files periodically
- **Log Rotation**: Manage log files to prevent disk space issues
- **Health Checks**: Run regular system and model health checks

### **🎯 Best Practices**

#### **Development Workflow**
1. **Code Analysis**: Regularly analyze code for quality and security
2. **AI Assistance**: Use AI-powered code generation for repetitive tasks
3. **System Monitoring**: Keep an eye on system resources and performance
4. **Model Training**: Continuously improve models with new data
5. **Plugin Development**: Extend functionality with custom plugins

#### **Security Practices**
- **Local Processing**: All operations run locally for maximum privacy
- **Model Validation**: Verify model integrity before loading
- **Access Control**: Configure appropriate access permissions
- **Data Protection**: Sensitive code never leaves your machine

#### **Performance Practices**
- **Resource Monitoring**: Regularly monitor system resource usage
- **Model Optimization**: Use appropriate models and quantization settings
- **Caching**: Enable caching for repeated operations
- **Background Tasks**: Run heavy operations in the background

### **🎉 Conclusion**

You now have a fully functional Local CLI Tool with:
- ✅ **Complete Web Interface**: Modern, responsive UI with all features
- ✅ **Local AI Integration**: Privacy-focused AI models for code generation and analysis
- ✅ **System Management**: Comprehensive system monitoring and troubleshooting
- ✅ **Model Training**: Custom model training with your datasets
- ✅ **Plugin System**: Extensible architecture for custom functionality
- ✅ **Performance Optimization**: Advanced configuration and monitoring tools

### **📖 Next Steps**

1. **Explore Features**: Try out different modules and capabilities
2. **Customize Configuration**: Adjust settings to match your workflow
3. **Train Custom Models**: Use your own datasets for specialized tasks
4. **Develop Plugins**: Create custom extensions for your needs
5. **Contribute to Community**: Share improvements and help others

---

## 🚀 **Ready to Use!**

Your Local CLI Tool is now set up and ready for use. Start exploring the features and enjoy the power of local, privacy-focused AI-powered development!

**Need Help?**
- Check the documentation in the `docs/` directory
- Visit the GitHub repository for issues and discussions
- Join our community for support and collaboration

Happy coding! 🎉
