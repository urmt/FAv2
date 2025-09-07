/**
 * Mock data service for development and testing
 * Provides realistic mock data when backend is not available
 */

import { SystemMetrics, ProcessInfo, CodeAnalysisResult } from './api'

// Mock system metrics generator
export const generateMockSystemMetrics = (): SystemMetrics => ({
  cpu: {
    usage: Math.random() * 100,
    cores: 8,
    temperature: 45 + Math.random() * 30,
  },
  memory: {
    total: 16 * 1024, // 16GB in MB
    used: (8 + Math.random() * 4) * 1024,
    available: (4 - Math.random() * 2) * 1024,
    percentage: 60 + Math.random() * 30,
  },
  disk: {
    total: 512 * 1024, // 512GB in MB
    used: (300 + Math.random() * 100) * 1024,
    available: (100 - Math.random() * 50) * 1024,
    percentage: 75 + Math.random() * 20,
  },
  network: {
    download: Math.random() * 100,
    upload: Math.random() * 50,
    latency: Math.random() * 50,
  },
})

// Mock processes data
export const generateMockProcesses = (): ProcessInfo[] => [
  {
    pid: 1234,
    name: 'node',
    cpu: 15.2,
    memory: 256,
    status: 'running',
    user: 'developer',
    startTime: '2024-01-15T10:30:00Z',
  },
  {
    pid: 5678,
    name: 'chrome',
    cpu: 8.7,
    memory: 512,
    status: 'running',
    user: 'developer',
    startTime: '2024-01-15T10:25:00Z',
  },
  {
    pid: 9012,
    name: 'vscode',
    cpu: 5.3,
    memory: 384,
    status: 'running',
    user: 'developer',
    startTime: '2024-01-15T10:20:00Z',
  },
  {
    pid: 3456,
    name: 'docker',
    cpu: 2.1,
    memory: 128,
    status: 'sleeping',
    user: 'root',
    startTime: '2024-01-15T09:45:00Z',
  },
  {
    pid: 7890,
    name: 'postgres',
    cpu: 1.8,
    memory: 96,
    status: 'running',
    user: 'postgres',
    startTime: '2024-01-15T09:30:00Z',
  },
]

// Mock code analysis results
export const generateMockCodeAnalysis = (): CodeAnalysisResult[] => [
  {
    file: 'src/components/App.tsx',
    issues: [
      {
        type: 'warning',
        message: 'Unused variable "unusedVar"',
        line: 45,
        column: 12,
        severity: 'low',
      },
      {
        type: 'error',
        message: 'Missing error handling in fetch call',
        line: 67,
        column: 8,
        severity: 'high',
      },
    ],
    metrics: {
      complexity: 7.2,
      maintainability: 82,
      linesOfCode: 156,
    },
  },
  {
    file: 'src/utils/helpers.ts',
    issues: [
      {
        type: 'warning',
        message: 'Function complexity too high',
        line: 23,
        column: 1,
        severity: 'medium',
      },
      {
        type: 'info',
        message: 'Consider adding JSDoc comments',
        line: 15,
        column: 1,
        severity: 'low',
      },
    ],
    metrics: {
      complexity: 12.5,
      maintainability: 68,
      linesOfCode: 89,
    },
  },
  {
    file: 'src/services/api.ts',
    issues: [
      {
        type: 'error',
        message: 'Type annotation missing for parameter',
        line: 34,
        column: 25,
        severity: 'medium',
      },
    ],
    metrics: {
      complexity: 4.8,
      maintainability: 91,
      linesOfCode: 234,
    },
  },
]

// Mock plugin data
export const mockPlugins = [
  {
    id: 'python-linter',
    name: 'Python Linter',
    version: '1.2.0',
    description: 'Advanced Python code analysis and linting',
    author: 'CLI Tool Team',
    installed: true,
    enabled: true,
    category: 'analysis',
  },
  {
    id: 'system-monitor',
    name: 'System Monitor',
    version: '2.1.0',
    description: 'Real-time system metrics and monitoring',
    author: 'CLI Tool Team',
    installed: true,
    enabled: true,
    category: 'system',
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    version: '0.9.0',
    description: 'Local AI-powered code generation and suggestions',
    author: 'CLI Tool Team',
    installed: false,
    enabled: false,
    category: 'ai',
  },
  {
    id: 'docker-manager',
    name: 'Docker Manager',
    version: '1.5.0',
    description: 'Container management and monitoring',
    author: 'CLI Tool Team',
    installed: true,
    enabled: false,
    category: 'system',
  },
]

// Mock diagnostic results
export const mockDiagnosticResults = [
  {
    test: 'memory',
    status: 'warning',
    message: 'Memory usage is above 80%',
    recommendations: ['Close unused applications', 'Consider adding more RAM'],
    timestamp: new Date().toISOString(),
  },
  {
    test: 'disk',
    status: 'critical',
    message: 'Disk space is critically low',
    recommendations: ['Clean up temporary files', 'Archive old files', 'Consider expanding storage'],
    timestamp: new Date().toISOString(),
  },
  {
    test: 'network',
    status: 'normal',
    message: 'Network connectivity is stable',
    recommendations: ['No action required'],
    timestamp: new Date().toISOString(),
  },
]

// Utility function to simulate API delay
export const simulateApiDelay = (min: number = 500, max: number = 2000) => {
  return new Promise(resolve => setTimeout(resolve, min + Math.random() * (max - min)))
}

// Mock API responses
export const mockApiService = {
  async getSystemMetrics() {
    await simulateApiDelay()
    return {
      success: true,
      data: generateMockSystemMetrics(),
    }
  },

  async getProcesses() {
    await simulateApiDelay()
    return {
      success: true,
      data: generateMockProcesses(),
    }
  },

  async killProcess(pid: number) {
    await simulateApiDelay()
    return {
      success: true,
      message: `Process ${pid} terminated successfully`,
    }
  },

  async runDiagnostic(test: string) {
    await simulateApiDelay()
    const result = mockDiagnosticResults.find(d => d.test === test) || mockDiagnosticResults[0]
    return {
      success: true,
      data: result,
    }
  },

  async analyzeCode(projectPath: string) {
    await simulateApiDelay(2000, 4000)
    return {
      success: true,
      data: generateMockCodeAnalysis(),
    }
  },

  async refactorCode(file: string, suggestions: string[]) {
    await simulateApiDelay(1000, 3000)
    return {
      success: true,
      message: `Refactoring applied to ${file}`,
    }
  },

  async generateCode(prompt: string, language: string) {
    await simulateApiDelay(1500, 3500)
    const mockCode = `// Generated ${language} code for: ${prompt}
// This is a mock implementation
function example() {
  console.log("Generated code for: ${prompt}");
  return "Hello from ${language}!";
}

export default example;`
    
    return {
      success: true,
      data: {
        code: mockCode,
        language,
      },
    }
  },

  async getPlugins() {
    await simulateApiDelay()
    return {
      success: true,
      data: mockPlugins,
    }
  },

  async installPlugin(pluginId: string) {
    await simulateApiDelay(1000, 2000)
    return {
      success: true,
      message: `Plugin ${pluginId} installed successfully`,
    }
  },

  async uninstallPlugin(pluginId: string) {
    await simulateApiDelay(800, 1500)
    return {
      success: true,
      message: `Plugin ${pluginId} uninstalled successfully`,
    }
  },

  async healthCheck() {
    await simulateApiDelay(200, 500)
    return {
      success: true,
      data: {
        status: 'healthy',
        version: '1.0.0',
      },
    }
  },
}
