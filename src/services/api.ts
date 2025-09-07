/**
 * API service for backend integration
 * Handles communication with local CLI tool backend
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature?: number
  }
  memory: {
    total: number
    used: number
    available: number
    percentage: number
  }
  disk: {
    total: number
    used: number
    available: number
    percentage: number
  }
  network: {
    download: number
    upload: number
    latency: number
  }
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number
  status: 'running' | 'sleeping' | 'stopped' | 'zombie'
  user: string
  startTime: string
}

export interface CodeAnalysisResult {
  file: string
  issues: {
    type: 'error' | 'warning' | 'info'
    message: string
    line: number
    column: number
    severity: 'low' | 'medium' | 'high'
  }[]
  metrics: {
    complexity: number
    maintainability: number
    linesOfCode: number
  }
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // System Management APIs
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    return this.request<SystemMetrics>('/system/metrics')
  }

  async getProcesses(): Promise<ApiResponse<ProcessInfo[]>> {
    return this.request<ProcessInfo[]>('/system/processes')
  }

  async killProcess(pid: number): Promise<ApiResponse> {
    return this.request(`/system/processes/${pid}/kill`, {
      method: 'POST',
    })
  }

  async runDiagnostic(test: string): Promise<ApiResponse> {
    return this.request('/system/diagnostics', {
      method: 'POST',
      body: JSON.stringify({ test }),
    })
  }

  // Code Analysis APIs
  async analyzeCode(projectPath: string): Promise<ApiResponse<CodeAnalysisResult[]>> {
    return this.request<CodeAnalysisResult[]>('/code/analyze', {
      method: 'POST',
      body: JSON.stringify({ projectPath }),
    })
  }

  async refactorCode(file: string, suggestions: string[]): Promise<ApiResponse> {
    return this.request('/code/refactor', {
      method: 'POST',
      body: JSON.stringify({ file, suggestions }),
    })
  }

  async generateCode(prompt: string, language: string): Promise<ApiResponse<{ code: string; language: string }>> {
    return this.request('/code/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, language }),
    })
  }

  // Plugin Management APIs
  async getPlugins(): Promise<ApiResponse<any[]>> {
    return this.request('/plugins')
  }

  async installPlugin(pluginId: string): Promise<ApiResponse> {
    return this.request('/plugins/install', {
      method: 'POST',
      body: JSON.stringify({ pluginId }),
    })
  }

  async uninstallPlugin(pluginId: string): Promise<ApiResponse> {
    return this.request(`/plugins/${pluginId}`, {
      method: 'DELETE',
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request('/health')
  }
}

export const apiService = new ApiService()
export default ApiService
