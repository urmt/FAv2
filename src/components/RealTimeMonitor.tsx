/**
 * RealTimeMonitor component for live performance monitoring
 * Provides real-time system and AI performance metrics
 */

import { useState, useEffect } from 'react'
import { Activity, Zap, Database, TrendingUp, RefreshCw, AlertTriangle, CheckCircle, Cpu, HardDrive, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { localAIService } from '@/services/aiService'

interface PerformanceMetrics {
  timestamp: Date
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  gpu_usage?: number
  network_io: {
    download: number
    upload: number
  }
  ai_metrics: {
    active_models: number
    total_requests: number
    average_response_time: number
    error_rate: number
  }
}

export default function RealTimeMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [aiServiceStatus, setAiServiceStatus] = useState<any>(null)

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        fetchMetrics()
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  useEffect(() => {
    loadSystemHealth()
    loadAIServiceStatus()
  }, [])

  const fetchMetrics = async () => {
    try {
      const resources = await localAIService.getSystemResources()
      const health = await localAIService.healthCheck()
      
      const newMetric: PerformanceMetrics = {
        timestamp: new Date(),
        cpu_usage: resources.cpu_usage || 0,
        memory_usage: resources.memory_usage || 0,
        disk_usage: resources.disk_usage || 0,
        gpu_usage: resources.gpu_usage || 0,
        network_io: {
          download: Math.random() * 100, // Mock network data
          upload: Math.random() * 50
        },
        ai_metrics: {
          active_models: health.models_healthy || 0,
          total_requests: Math.floor(Math.random() * 1000) + 500, // Mock request count
          average_response_time: Math.random() * 500 + 100, // Mock response time
          error_rate: Math.random() * 5 // Mock error rate
        }
      }
      
      setMetrics(prev => [...prev.slice(-29), newMetric]) // Keep last 30 metrics
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
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

  const loadAIServiceStatus = async () => {
    try {
      const resources = await localAIService.getSystemResources()
      setAiServiceStatus(resources)
    } catch (error) {
      console.error('Failed to load AI service status:', error)
    }
  }

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const getLatestMetrics = () => {
    return metrics[metrics.length - 1] || null
  }

  const getAverageMetrics = () => {
    if (metrics.length === 0) return null
    
    const avg = metrics.reduce((acc, metric) => ({
      cpu_usage: acc.cpu_usage + metric.cpu_usage,
      memory_usage: acc.memory_usage + metric.memory_usage,
      disk_usage: acc.disk_usage + metric.disk_usage,
      gpu_usage: acc.gpu_usage + (metric.gpu_usage || 0),
      average_response_time: acc.average_response_time + metric.ai_metrics.average_response_time,
      error_rate: acc.error_rate + metric.ai_metrics.error_rate
    }), {
      cpu_usage: 0,
      memory_usage: 0,
      disk_usage: 0,
      gpu_usage: 0,
      average_response_time: 0,
      error_rate: 0
    })
    
    const count = metrics.length
    return {
      cpu_usage: avg.cpu_usage / count,
      memory_usage: avg.memory_usage / count,
      disk_usage: avg.disk_usage / count,
      gpu_usage: avg.gpu_usage / count,
      average_response_time: avg.average_response_time / count,
      error_rate: avg.error_rate / count
    }
  }

  const getStatusColor = (value: number, type: 'usage' | 'response' | 'error') => {
    switch (type) {
      case 'usage':
        if (value < 50) return 'text-green-400'
        if (value < 80) return 'text-yellow-400'
        return 'text-red-400'
      case 'response':
        if (value < 200) return 'text-green-400'
        if (value < 500) return 'text-yellow-400'
        return 'text-red-400'
      case 'error':
        if (value < 1) return 'text-green-400'
        if (value < 3) return 'text-yellow-400'
        return 'text-red-400'
      default:
        return 'text-white'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const latest = getLatestMetrics()
  const average = getAverageMetrics()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Real-time Monitor</h2>
            <p className="text-slate-400">Live system and AI performance metrics</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleMonitoring}
            variant={isMonitoring ? "default" : "outline"}
            className={isMonitoring ? "bg-green-600 hover:bg-green-700" : "bg-transparent border-slate-600"}
          >
            {isMonitoring ? (
              <>
                <div className="h-2 w-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Stop Monitoring
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
          <Button variant="outline" onClick={loadSystemHealth} className="bg-transparent border-slate-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
            System
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-slate-700">
            AI Service
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-slate-700">
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  CPU Usage
                </CardTitle>
                <Cpu className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(latest?.cpu_usage || 0, 'usage')}`}>
                  {latest?.cpu_usage.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  {average && `Avg: ${average.cpu_usage.toFixed(1)}%`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Memory
                </CardTitle>
                <Database className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(latest?.memory_usage || 0, 'usage')}`}>
                  {latest?.memory_usage.toFixed(1) || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  {average && `Avg: ${average.memory_usage.toFixed(1)}%`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  AI Response Time
                </CardTitle>
                <Zap className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(latest?.ai_metrics.average_response_time || 0, 'response')}`}>
                  {latest?.ai_metrics.average_response_time.toFixed(0) || 0}ms
                </div>
                <p className="text-xs text-slate-400">
                  {average && `Avg: ${average.average_response_time.toFixed(0)}ms`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Error Rate
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getStatusColor(latest?.ai_metrics.error_rate || 0, 'error')}`}>
                  {latest?.ai_metrics.error_rate.toFixed(2) || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  {average && `Avg: ${average.error_rate.toFixed(2)}%`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Service Status:</span>
                    <Badge className={systemHealth?.status === 'healthy' ? 'bg-green-600' : 'bg-red-600'}>
                      {systemHealth?.status || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Models:</span>
                    <span className="text-white">{latest?.ai_metrics.active_models || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Requests:</span>
                    <span className="text-white">{latest?.ai_metrics.total_requests.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white">
                      {systemHealth?.uptime ? Math.floor(systemHealth.uptime / 60) + 'm' : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-400" />
                  AI Service Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GPU Available:</span>
                    <Badge className={aiServiceStatus?.gpu_devices?.length > 0 ? 'bg-green-600' : 'bg-gray-600'}>
                      {aiServiceStatus?.gpu_devices?.length > 0 ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CPU Cores:</span>
                    <span className="text-white">{aiServiceStatus?.cpu_cores || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Memory:</span>
                    <span className="text-white">
                      {aiServiceStatus?.memory_total ? formatMemory(aiServiceStatus.memory_total) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Memory:</span>
                    <span className="text-white">
                      {aiServiceStatus?.memory_available ? formatMemory(aiServiceStatus.memory_available) : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Resource Monitor</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time system resource utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">CPU & Memory</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">CPU Usage</span>
                        <span className="text-white">{latest?.cpu_usage.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${latest?.cpu_usage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Memory Usage</span>
                        <span className="text-white">{latest?.memory_usage.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${latest?.memory_usage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Storage & Network</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Disk Usage</span>
                        <span className="text-white">{latest?.disk_usage.toFixed(1) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${latest?.disk_usage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Download</span>
                          <span className="text-white">{latest?.network_io.download.toFixed(1) || 0} MB/s</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((latest?.network_io.download || 0) / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Upload</span>
                          <span className="text-white">{latest?.network_io.upload.toFixed(1) || 0} MB/s</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((latest?.network_io.upload || 0) / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Service Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Service Performance</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time AI model performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Model Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Active Models</span>
                        <span className="text-white">{latest?.ai_metrics.active_models || 0}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((latest?.ai_metrics.active_models || 0) / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Response Time</span>
                        <span className="text-white">{latest?.ai_metrics.average_response_time.toFixed(0) || 0}ms</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((latest?.ai_metrics.average_response_time || 0) / 1000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Request Statistics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Total Requests</span>
                        <span className="text-white">{latest?.ai_metrics.total_requests.toLocaleString() || 0}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(((latest?.ai_metrics.total_requests || 0) / 10000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Error Rate</span>
                        <span className="text-white">{latest?.ai_metrics.error_rate.toFixed(2) || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${latest?.ai_metrics.error_rate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Performance History</CardTitle>
              <CardDescription className="text-slate-400">
                Historical performance data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {metrics.slice(-20).reverse().map((metric, index) => (
                    <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          {metric.timestamp.toLocaleTimeString()}
                        </span>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className={`border-green-600 text-green-400 ${metric.cpu_usage > 80 ? '!border-red-600 !text-red-400' : ''}`}>
                            CPU: {metric.cpu_usage.toFixed(1)}%
                          </Badge>
                          <Badge variant="outline" className={`border-blue-600 text-blue-400 ${metric.ai_metrics.average_response_time > 500 ? '!border-red-600 !text-red-400' : ''}`}>
                            AI: {metric.ai_metrics.average_response_time.toFixed(0)}ms
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400">Memory:</span>
                          <span className={`ml-1 ${getStatusColor(metric.memory_usage, 'usage')}`}>
                            {metric.memory_usage.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Models:</span>
                          <span className="ml-1 text-white">
                            {metric.ai_metrics.active_models}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Requests:</span>
                          <span className="ml-1 text-white">
                            {metric.ai_metrics.total_requests}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Errors:</span>
                          <span className={`ml-1 ${getStatusColor(metric.ai_metrics.error_rate, 'error')}`}>
                            {metric.ai_metrics.error_rate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No performance data available. Start monitoring to see historical data.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
