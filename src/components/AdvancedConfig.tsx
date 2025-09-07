/**
 * AdvancedConfig component for detailed system and AI configuration
 * Provides interface for advanced settings, optimization, and system tuning
 */

import { useState, useEffect } from 'react'
import { Settings, Cpu, HardDrive, Zap, Save, RefreshCw, Download, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { localAIService } from '@/services/aiService'

interface SystemConfig {
  max_concurrent_models: number
  memory_limit_gb: number
  gpu_memory_reserved_gb: number
  auto_cleanup_enabled: boolean
  cleanup_interval_hours: number
  log_level: 'debug' | 'info' | 'warning' | 'error'
  enable_telemetry: boolean
}

interface AIConfig {
  default_model: string
  temperature_default: number
  max_tokens_default: number
  top_p_default: number
  enable_cache: boolean
  cache_ttl_hours: number
  enable_quantization: boolean
  quantization_bits: 4 | 8
}

interface PerformanceConfig {
  enable_gpu_acceleration: boolean
  cpu_threads: number
  batch_size_default: number
  enable_mixed_precision: boolean
  optimize_for_memory: boolean
  enable_profiling: boolean
}

export default function AdvancedConfig() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    max_concurrent_models: 2,
    memory_limit_gb: 8,
    gpu_memory_reserved_gb: 2,
    auto_cleanup_enabled: true,
    cleanup_interval_hours: 24,
    log_level: 'info',
    enable_telemetry: false
  })

  const [aiConfig, setAiConfig] = useState<AIConfig>({
    default_model: 'codebert-small',
    temperature_default: 0.7,
    max_tokens_default: 512,
    top_p_default: 0.9,
    enable_cache: true,
    cache_ttl_hours: 6,
    enable_quantization: true,
    quantization_bits: 4
  })

  const [performanceConfig, setPerformanceConfig] = useState<PerformanceConfig>({
    enable_gpu_acceleration: true,
    cpu_threads: 4,
    batch_size_default: 16,
    enable_mixed_precision: true,
    optimize_for_memory: true,
    enable_profiling: false
  })

  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSystemHealth()
  }, [])

  const loadSystemHealth = async () => {
    try {
      const health = await localAIService.healthCheck()
      setSystemHealth(health)
    } catch (error) {
      console.error('Failed to load system health:', error)
    }
  }

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      // Simulate saving configuration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would save to a config file
      console.log('Configuration saved:', { systemConfig, aiConfig, performanceConfig })
      
    } catch (error) {
      console.error('Failed to save configuration:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportConfig = () => {
    const config = {
      system: systemConfig,
      ai: aiConfig,
      performance: performanceConfig,
      exported_at: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-tool-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string)
          if (config.system) setSystemConfig(config.system)
          if (config.ai) setAiConfig(config.ai)
          if (config.performance) setPerformanceConfig(config.performance)
          alert('Configuration imported successfully!')
        } catch (error) {
          alert('Failed to import configuration. Invalid file format.')
        }
      }
      reader.readAsText(file)
    }
    // Reset the input value
    event.target.value = ''
  }

  const handleResetToDefaults = () => {
    setSystemConfig({
      max_concurrent_models: 2,
      memory_limit_gb: 8,
      gpu_memory_reserved_gb: 2,
      auto_cleanup_enabled: true,
      cleanup_interval_hours: 24,
      log_level: 'info',
      enable_telemetry: false
    })
    
    setAiConfig({
      default_model: 'codebert-small',
      temperature_default: 0.7,
      max_tokens_default: 512,
      top_p_default: 0.9,
      enable_cache: true,
      cache_ttl_hours: 6,
      enable_quantization: true,
      quantization_bits: 4
    })
    
    setPerformanceConfig({
      enable_gpu_acceleration: true,
      cpu_threads: 4,
      batch_size_default: 16,
      enable_mixed_precision: true,
      optimize_for_memory: true,
      enable_profiling: false
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Advanced Configuration</h2>
            <p className="text-slate-400">Fine-tune system and AI settings for optimal performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadSystemHealth} className="bg-transparent border-slate-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
            System
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-slate-700">
            AI Models
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
            Performance
          </TabsTrigger>
          <TabsTrigger value="import-export" className="data-[state=active]:bg-slate-700">
            Import/Export
          </TabsTrigger>
        </TabsList>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Configure system-wide settings and resource limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Resource Limits</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Max Concurrent Models</label>
                      <input 
                        type="number" 
                        min="1"
                        max="10"
                        value={systemConfig.max_concurrent_models}
                        onChange={(e) => setSystemConfig(prev => ({ ...prev, max_concurrent_models: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Memory Limit (GB)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="64"
                        value={systemConfig.memory_limit_gb}
                        onChange={(e) => setSystemConfig(prev => ({ ...prev, memory_limit_gb: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">GPU Memory Reserved (GB)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="24"
                        value={systemConfig.gpu_memory_reserved_gb}
                        onChange={(e) => setSystemConfig(prev => ({ ...prev, gpu_memory_reserved_gb: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Maintenance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Auto Cleanup</h5>
                        <p className="text-xs text-slate-400">Automatically clean up unused models and cache</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={systemConfig.auto_cleanup_enabled}
                          onChange={(e) => setSystemConfig(prev => ({ ...prev, auto_cleanup_enabled: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {systemConfig.auto_cleanup_enabled && (
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Cleanup Interval (hours)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="168"
                          value={systemConfig.cleanup_interval_hours}
                          onChange={(e) => setSystemConfig(prev => ({ ...prev, cleanup_interval_hours: parseInt(e.target.value) }))}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Logging & Telemetry</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mb-1 block">Log Level</label>
                    <select 
                      value={systemConfig.log_level}
                      onChange={(e) => setSystemConfig(prev => ({ ...prev, log_level: e.target.value as any }))}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="debug">Debug</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Enable Telemetry</h5>
                      <p className="text-xs text-slate-400">Share anonymous usage data to improve the tool</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={systemConfig.enable_telemetry}
                        onChange={(e) => setSystemConfig(prev => ({ ...prev, enable_telemetry: e.target.checked }))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Model Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Configure AI model behavior and generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Default Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Default Model</label>
                      <select 
                        value={aiConfig.default_model}
                        onChange={(e) => setAiConfig(prev => ({ ...prev, default_model: e.target.value }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="codebert-small">CodeBERT Small</option>
                        <option value="distilgpt2-code">DistilGPT2 Code</option>
                        <option value="tinyllama">TinyLLaMA</option>
                        <option value="starcoderbase">StarCoder Base</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Default Temperature</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0.1"
                        max="2.0"
                        value={aiConfig.temperature_default}
                        onChange={(e) => setAiConfig(prev => ({ ...prev, temperature_default: parseFloat(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Max Tokens</label>
                      <input 
                        type="number" 
                        min="64"
                        max="4096"
                        value={aiConfig.max_tokens_default}
                        onChange={(e) => setAiConfig(prev => ({ ...prev, max_tokens_default: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Top-P</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0.1"
                        max="1.0"
                        value={aiConfig.top_p_default}
                        onChange={(e) => setAiConfig(prev => ({ ...prev, top_p_default: parseFloat(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Caching & Optimization</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Enable Caching</h5>
                        <p className="text-xs text-slate-400">Cache generated code and analysis results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={aiConfig.enable_cache}
                          onChange={(e) => setAiConfig(prev => ({ ...prev, enable_cache: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {aiConfig.enable_cache && (
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Cache TTL (hours)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="168"
                          value={aiConfig.cache_ttl_hours}
                          onChange={(e) => setAiConfig(prev => ({ ...prev, cache_ttl_hours: parseInt(e.target.value) }))}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Enable Quantization</h5>
                        <p className="text-xs text-slate-400">Use quantized models for memory efficiency</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={aiConfig.enable_quantization}
                          onChange={(e) => setAiConfig(prev => ({ ...prev, enable_quantization: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {aiConfig.enable_quantization && (
                      <div>
                        <label className="text-sm text-slate-300 mb-1 block">Quantization Bits</label>
                        <select 
                          value={aiConfig.quantization_bits}
                          onChange={(e) => setAiConfig(prev => ({ ...prev, quantization_bits: parseInt(e.target.value) as any }))}
                          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        >
                          <option value={4}>4-bit (Most Efficient)</option>
                          <option value={8}>8-bit (Balanced)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Configuration Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Optimize performance settings for AI model execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Hardware Acceleration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Enable GPU Acceleration</h5>
                        <p className="text-xs text-slate-400">Use GPU for faster model inference</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={performanceConfig.enable_gpu_acceleration}
                          onChange={(e) => setPerformanceConfig(prev => ({ ...prev, enable_gpu_acceleration: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">CPU Threads</label>
                      <input 
                        type="number" 
                        min="1"
                        max="16"
                        value={performanceConfig.cpu_threads}
                        onChange={(e) => setPerformanceConfig(prev => ({ ...prev, cpu_threads: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Batch Processing</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Default Batch Size</label>
                      <select 
                        value={performanceConfig.batch_size_default}
                        onChange={(e) => setPerformanceConfig(prev => ({ ...prev, batch_size_default: parseInt(e.target.value) }))}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="8">8 (Small)</option>
                        <option value="16">16 (Medium)</option>
                        <option value="32">32 (Large)</option>
                        <option value="64">64 (Extra Large)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Mixed Precision</h5>
                        <p className="text-xs text-slate-400">Use FP16 for faster computation</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={performanceConfig.enable_mixed_precision}
                          onChange={(e) => setPerformanceConfig(prev => ({ ...prev, enable_mixed_precision: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Optimization Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Optimize for Memory</h5>
                      <p className="text-xs text-slate-400">Prioritize memory usage over speed</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={performanceConfig.optimize_for_memory}
                        onChange={(e) => setPerformanceConfig(prev => ({ ...prev, optimize_for_memory: e.target.checked }))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Enable Profiling</h5>
                      <p className="text-xs text-slate-400">Collect performance metrics and statistics</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={performanceConfig.enable_profiling}
                        onChange={(e) => setPerformanceConfig(prev => ({ ...prev, enable_profiling: e.target.checked }))}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-400" />
                  Export Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Save your current configuration to a file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Export Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">System Config:</span>
                      <span className="text-white">Resource limits, maintenance settings</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI Config:</span>
                      <span className="text-white">Model parameters, caching settings</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Performance Config:</span>
                      <span className="text-white">Hardware optimization, batch settings</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleExportConfig}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-blue-400" />
                  Import Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Load configuration from a previously saved file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Import Requirements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white">JSON format configuration file</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white">Compatible with this tool version</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white">Valid configuration structure</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={handleImportConfig}
                    className="hidden"
                    id="import-config"
                  />
                  <Button 
                    onClick={() => document.getElementById('import-config')?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-yellow-400" />
                Configuration Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Additional configuration options and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleResetToDefaults}
                  variant="outline"
                  className="bg-transparent border-slate-600"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-transparent border-slate-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Config
                </Button>
              </div>
              
              {systemHealth && (
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">System Status</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service Status:</span>
                      <Badge className={systemHealth.status === 'healthy' ? 'bg-green-600' : 'bg-red-600'}>
                        {systemHealth.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Models Healthy:</span>
                      <span className="text-white">{systemHealth.models_healthy}/{systemHealth.total_models}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Uptime:</span>
                      <span className="text-white">{Math.floor(systemHealth.uptime / 60)} minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
