/**
 * ModelManagement component for managing local AI models
 * Provides interface for downloading, loading, and monitoring AI models
 */

import { useState, useEffect } from 'react'
import { Brain, Download, Trash2, Settings, Play, Pause, CheckCircle, AlertTriangle, RefreshCw, Activity, HardDrive, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { localAIService, LocalAIModel } from '@/services/aiService'

export default function ModelManagement() {
  const [models, setModels] = useState<LocalAIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<LocalAIModel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [systemResources, setSystemResources] = useState<any>(null)

  useEffect(() => {
    loadModels()
    loadSystemHealth()
  }, [])

  const loadModels = async () => {
    setIsLoading(true)
    try {
      const availableModels = await localAIService.getAvailableModels()
      setModels(availableModels)
      
      if (availableModels.length > 0) {
        const firstLoaded = availableModels.find(m => m.is_loaded) || availableModels[0]
        setSelectedModel(firstLoaded)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSystemHealth = async () => {
    try {
      const health = await localAIService.healthCheck()
      setSystemHealth(health)
    } catch (error) {
      console.error('Failed to load system health:', error)
    }
  }

  const loadSystemResources = async () => {
    try {
      const resources = await localAIService.getSystemResources()
      setSystemResources(resources)
    } catch (error) {
      console.error('Failed to load system resources:', error)
    }
  }

  const handleDownloadModel = async (modelId: string) => {
    try {
      const success = await localAIService.downloadModel(modelId)
      if (success) {
        await loadModels()
      }
    } catch (error) {
      console.error('Failed to download model:', error)
    }
  }

  const handleLoadModel = async (modelId: string) => {
    try {
      const success = await localAIService.loadModel(modelId)
      if (success) {
        await loadModels()
        await loadSystemHealth()
      }
    } catch (error) {
      console.error('Failed to load model:', error)
    }
  }

  const handleUnloadModel = async (modelId: string) => {
    try {
      const success = await localAIService.unloadModel(modelId)
      if (success) {
        await loadModels()
        await loadSystemHealth()
      }
    } catch (error) {
      console.error('Failed to unload model:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600'
      case 'loaded': return 'bg-blue-600'
      case 'loading': return 'bg-yellow-600'
      case 'not_downloaded': return 'bg-gray-600'
      case 'error': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusIcon = (model: LocalAIModel) => {
    if (model.is_loaded) return <CheckCircle className="h-4 w-4 text-green-400" />
    if (model.status === 'loading') return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
    if (model.status === 'error') return <AlertTriangle className="h-4 w-4 text-red-400" />
    return <Brain className="h-4 w-4 text-gray-400" />
  }

  const formatMemory = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Model Management</h2>
            <p className="text-slate-400">Manage and monitor local AI models</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadModels} className="bg-transparent border-slate-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={loadSystemHealth} className="bg-transparent border-slate-600">
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger value="models" className="data-[state=active]:bg-slate-700">
            Models
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
            System Health
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-slate-700">
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading models...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <Card key={model.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white flex items-center">
                          {getStatusIcon(model)}
                          <span className="ml-2">{model.name}</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {model.description}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(model.status)}>
                        {model.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Size:</span>
                          <span className="text-white ml-1">{model.size}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Type:</span>
                          <span className="text-white ml-1">{model.type}</span>
                        </div>
                        {model.is_loaded && (
                          <>
                            <div>
                              <span className="text-slate-400">Memory:</span>
                              <span className="text-white ml-1">{formatMemory(model.memory_usage * 1024 * 1024)}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Load Time:</span>
                              <span className="text-white ml-1">{model.load_time.toFixed(1)}s</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Capabilities:</div>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, 3).map((capability) => (
                            <Badge key={capability} variant="outline" className="text-xs border-slate-600">
                              {capability}
                            </Badge>
                          ))}
                          {model.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs border-slate-600">
                              +{model.capabilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          {model.is_loaded ? (
                            <Badge className="bg-green-600">Loaded</Badge>
                          ) : model.status === 'not_downloaded' ? (
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              Not Downloaded
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Ready</Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          {model.status === 'not_downloaded' && (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadModel(model.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {!model.is_loaded && model.status !== 'not_downloaded' && (
                            <Button
                              size="sm"
                              onClick={() => handleLoadModel(model.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {model.is_loaded && (
                            <Button
                              size="sm"
                              onClick={() => handleUnloadModel(model.id)}
                              variant="outline"
                              className="bg-transparent border-red-600 text-red-400 hover:bg-red-600/10"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent border-slate-600"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Service Status
                </CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemHealth?.status || 'Unknown'}
                </div>
                <p className="text-xs text-slate-400">
                  AI Service Health
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Healthy Models
                </CardTitle>
                <Brain className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemHealth?.models_healthy || 0}
                </div>
                <p className="text-xs text-slate-400">
                  Loaded and Ready
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Total Models
                </CardTitle>
                <Brain className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {models.length}
                </div>
                <p className="text-xs text-slate-400">
                  Available Models
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Uptime
                </CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemHealth?.uptime ? Math.floor(systemHealth.uptime / 60) + 'm' : 'N/A'}
                </div>
                <p className="text-xs text-slate-400">
                  Service Running
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Health Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">AI Service</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <Badge className={systemHealth?.status === 'healthy' ? 'bg-green-600' : 'bg-red-600'}>
                          {systemHealth?.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Models:</span>
                        <span className="text-white">{systemHealth?.models_healthy || 0}/{systemHealth?.total_models || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Response Time:</span>
                        <span className="text-white">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Error Rate:</span>
                        <span className="text-white">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  CPU Usage
                </CardTitle>
                <Cpu className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.cpu_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  Current Load
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Memory
                </CardTitle>
                <Activity className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.memory_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  RAM Used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Disk Space
                </CardTitle>
                <HardDrive className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.disk_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  Storage Used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  GPU Memory
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.gpu_memory || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  VRAM Used
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Resource Details</CardTitle>
              <CardDescription className="text-slate-400">
                Current system resource utilization and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemResources && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">CPU Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cores:</span>
                          <span className="text-white">{systemResources.cpu_cores || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Usage:</span>
                          <span className="text-white">{systemResources.cpu_usage || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Temperature:</span>
                          <span className="text-white">{systemResources.cpu_temperature || 'N/A'}°C</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Memory Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-white">{formatMemory(systemResources.memory_total || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Used:</span>
                          <span className="text-white">{formatMemory(systemResources.memory_used || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Available:</span>
                          <span className="text-white">{formatMemory(systemResources.memory_available || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {systemResources.gpu_devices && systemResources.gpu_devices.length > 0 && (
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <h4 className="font-medium text-white mb-2">GPU Information</h4>
                        <div className="space-y-2 text-sm">
                          {systemResources.gpu_devices.map((gpu: any, index: number) => (
                            <div key={index} className="border-t border-slate-600 pt-2">
                              <div className="flex justify-between">
                                <span className="text-slate-400">GPU {index}:</span>
                                <span className="text-white">{gpu.name || 'Unknown'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Memory:</span>
                                <span className="text-white">{formatMemory(gpu.memory_used || 0)}/{formatMemory(gpu.memory_total || 0)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
