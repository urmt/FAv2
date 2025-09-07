# Local CLI Tool - Web Interface

A modern web-based interface for a comprehensive local CLI tool that integrates code analysis, system management, and AI-powered code generation capabilities.

## 🚀 Features

### Code Analysis Module
- **Static Code Analysis**: Comprehensive linting and code quality checks
- **Automated Refactoring**: AI-powered suggestions for code improvements
- **Multi-language Support**: JavaScript, Python, TypeScript, React, Bash, HTML
- **Real-time Feedback**: Instant analysis results with severity levels
- **Issue Tracking**: Categorize and manage code issues by type and severity

### System Management Module
- **Real-time Monitoring**: CPU, Memory, Disk, and Network usage tracking
- **Process Management**: View and manage running processes
- **System Diagnostics**: Comprehensive health checks and troubleshooting
- **Resource Optimization**: Recommendations for system performance
- **Alert System**: Proactive notifications for critical issues

### Code Generation
- **Natural Language to Code**: Generate code from plain English descriptions
- **Multiple Languages**: Support for 6+ programming languages
- **Template-based Generation**: Pre-built templates for common patterns
- **Code History**: Track and revisit previous generations
- **Export Options**: Copy to clipboard or download generated files

### Plugin System
- **Extensible Architecture**: Modular plugin framework
- **Plugin Marketplace**: Browse and install community plugins
- **Custom Development**: API for creating custom extensions
- **Plugin Management**: Enable, disable, and configure plugins

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Routing**: React Router
- **Build Tool**: ESBuild

## 📦 Installation

### 🖥️ System Requirements
**IMPORTANT**: This application supports local AI models. Please review the [System Requirements](SYSTEM_REQUIREMENTS.md) before installation.

#### Minimum Requirements (Basic Web Interface)
- Node.js 16+ 
- npm or yarn
- 4GB RAM
- 2GB free disk space

#### Recommended Requirements (Local AI Features)
- Node.js 18+
- Python 3.8+
- 8GB RAM (16GB recommended)
- 20GB free disk space (SSD recommended)
- NVIDIA GPU with 6GB+ VRAM (optional, for GPU acceleration)

### 🔧 Setup

#### Option 1: Web Interface Only (Basic)
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

#### Option 2: Full Setup with Local AI (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/local-cli-tool.git
cd local-cli-tool

# Install web interface dependencies
npm install

# Setup local AI service
cd local-ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start the local AI service (in a separate terminal)
python main.py

# Return to project root and start web interface
cd ..
npm run dev

# Open your browser and navigate to http://localhost:3000
```

#### Option 3: Production Deployment
```bash
# Build the web interface
npm run build

# Start production server
npm start

# Setup local AI service as a system service (see docs/LOCAL_AI_SETUP.md)
```

### 🤖 Local AI Setup

For detailed instructions on setting up local AI models, see:
- [Local AI Setup Guide](docs/LOCAL_AI_SETUP.md)
- [System Requirements](SYSTEM_REQUIREMENTS.md)

#### Quick Start for Local AI:
```bash
# Navigate to AI service directory
cd local-ai-service

# Download a lightweight model (CPU-friendly)
curl -X POST "http://localhost:8000/models/codebert-small/download"

# Load the model
curl -X POST "http://localhost:8000/models/codebert-small/load"

# Test code generation
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "model_name": "codebert-small",
    "prompt": "def fibonacci(n):",
    "max_length": 200
  }'
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── CodeAnalysis.tsx # Code analysis module
│   ├── SystemManagement.tsx # System management module
│   └── CodeGeneration.tsx # Code generation module
├── pages/               # Page components
│   └── Home.tsx         # Main dashboard page
├── App.tsx              # Main app component with routing
└── main.tsx             # Application entry point
```

## 🎯 Usage

### Dashboard Overview
The main dashboard provides:
- System status overview with key metrics
- Quick actions for common tasks
- Recent activity feed
- Navigation to all modules

### Code Analysis
1. Navigate to the Code Analysis tab
2. Click "Start Analysis" to scan your codebase
3. Review results categorized by severity
4. Apply refactoring suggestions with one click

### System Management
1. Access the System Management tab
2. Monitor real-time system metrics
3. View running processes and resource usage
4. Run diagnostic tests for system health

### Code Generation
1. Go to the Code Generation section
2. Select your target programming language
3. Describe what you want to create in natural language
4. Generate, copy, or download the code

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration (if using external services)
VITE_API_BASE_URL=http://localhost:8080
VITE_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_AI_GENERATION=true
VITE_ENABLE_SYSTEM_MONITORING=true
```

### Customization
- **Theme**: Modify the color scheme in `src/pages/Home.tsx`
- **Languages**: Add support for new languages in `CodeGeneration.tsx`
- **Plugins**: Extend functionality using the plugin system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Write JSDoc comments for all components and functions
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component library
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **React** team for the amazing framework

## 📞 Support

For support, questions, or feature requests:
1. Check the [Issues](https://github.com/yourusername/local-cli-tool/issues) page
2. Create a new issue if needed
3. Join our community discussions

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Basic web interface
- [x] Code analysis module
- [x] System monitoring
- [x] Code generation
- [x] Plugin system foundation

### Phase 2 (Future)
- [ ] Real backend integration
- [ ] Local AI model support
- [ ] Advanced system diagnostics
- [ ] Team collaboration features
- [ ] Mobile responsive design

### Phase 3 (Advanced)
- [ ] CLI tool integration
- [ ] Cloud synchronization
- [ ] Advanced analytics
- [ ] Machine learning optimizations
- [ ] Enterprise features

---

Built with ❤️ for developers who value privacy, efficiency, and local-first tools.
