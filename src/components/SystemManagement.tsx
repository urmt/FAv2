
import { useState, useEffect } from 'react'
import { Monitor, Activity, Cpu, HardDrive, Wifi, MemoryStick, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * SystemManagement component for monitoring system resources and managing processes
 * Provides real-time system metrics and process management interface
 */
interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  icon: React.ReactNode
}

interface Process {
  id: number
  name: string
  cpu: number
  memory: number
  status: 'running' | 'sleeping' | 'stopped'
}

export default function SystemManagement() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock system metrics
  const mockMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 35,
      unit: '%',
      status: 'normal',
      icon: <Cpu className="h-4 w-4" />
    },
    {
      name: 'Memory',
      value: 68,
      unit: '%',
      status: 'warning',
      icon: <MemoryStick className="h-4 w-4" />
    },
    {
      name: 'Disk Space',
      value: 80,
      unit: '%',
      status: 'critical',
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      name: 'Network',
      value: 12,
      unit: '%',
      status: 'normal',
      icon: <Wifi className="h-4 w-4" />
    }
  ]

  // Mock processes
  const mockProcesses: Process[] = [
    { id: 1234, name: 'node', cpu: 15.2, memory: 256, status: 'running' },
    { id: 5678, name: 'chrome', cpu: 8.7, memory: 512, status: 'running' },
    { id: 9012, name: 'vscode', cpu: 5.3, memory: 384, status: 'running' },
    { id: 3456, name: 'docker', cpu: 2.1, memory: 128, status: 'sleeping' },
    { id: 7890, name: 'postgres', cpu: 1.8, memory: 96, status: 'running' }
  ]

  useEffect(() => {
    setMetrics(mockMetrics)
    setProcesses(mockProcesses)
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setMetrics(mockMetrics.map(metric => ({
        ...metric,
        value: Math.min(100, metric.value + (Math.random() - 0.5) * 10)
      })))
      setIsRefreshing(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'critical':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-600">Normal</Badge>
      case 'warning':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-400">Warning</Badge>
      case 'critical':
        return <Badge variant="destructive" className="bg-red-600">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getProcessStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-600">Running</Badge>
      case 'sleeping':
        return <Badge variant="outline" className="border-blue-600 text-blue-400">Sleeping</Badge>
      case 'stopped':
        return <Badge variant="destructive" className="bg-red-600">Stopped</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Monitor className="h-6 w-6 mr-2 text-blue-400" />
            System Management
          </h2>
          <p className="text-slate-400">Monitor system resources and manage processes</p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          variant="outline" 
          className="bg-transparent border-slate-600"
        >
          {isRefreshing ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
            Overview
          </TabsTrigger>
          <TabsTrigger value="processes" className="data-[state=active]:bg-slate-700">
            Processes
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="data-[state=active]:bg-slate-700">
            Diagnostics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name} className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {metric.name}
                  </CardTitle>
                  <div className={getStatusColor(metric.status)}>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {metric.value.toFixed(1)}{metric.unit}
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(metric.status)}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'normal' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Health */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-slate-400">
                Overall system status and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <h4 className="font-medium text-white">Memory Usage Warning</h4>
                    <p className="text-sm text-slate-400">
                      Memory usage is at 68%. Consider closing unused applications or adding more RAM.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div>
                    <h4 className="font-medium text-white">Disk Space Critical</h4>
                    <p className="text-sm text-slate-400">
                      Disk space is at 80%. Clean up temporary files or consider expanding storage.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <h4 className="font-medium text-white">Network Status Normal</h4>
                    <p className="text-sm text-slate-400">
                      Network connectivity is stable with low latency.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processes Tab */}
        <TabsContent value="processes" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Running Processes</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage system processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processes.map((process) => (
                  <div key={process.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-white">{process.name}</h4>
                        <p className="text-sm text-slate-400">PID: {process.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-white">CPU: {process.cpu}%</p>
                        <p className="text-sm text-slate-400">Memory: {process.memory}MB</p>
                      </div>
                      {getProcessStatusBadge(process.status)}
                      <Button size="sm" variant="outline" className="bg-transparent border-slate-600">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnostics Tab */}
        <TabsContent value="diagnostics" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Diagnostics</CardTitle>
              <CardDescription className="text-slate-400">
                Run diagnostic tests and troubleshoot system issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-16 flex-col bg-slate-700 hover:bg-slate-600">
                  <Monitor className="h-6 w-6 mb-2" />
                  Run Full System Scan
                </Button>
                <Button className="h-16 flex-col bg-slate-700 hover:bg-slate-600">
                  <HardDrive className="h-6 w-6 mb-2" />
                  Check Disk Health
                </Button>
                <Button className="h-16 flex-col bg-slate-700 hover:bg-slate-600">
                  <MemoryStick className="h-6 w-6 mb-2" />
                  Memory Test
                </Button>
                <Button className="h-16 flex-col bg-slate-700 hover:bg-slate-600">
                  <Cpu className="h-6 w-6 mb-2" />
                  CPU Benchmark
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Diagnostic Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div>
                      <h4 className="font-medium text-white">Memory Test</h4>
                      <p className="text-sm text-slate-400">Completed successfully</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <div>
                      <h4 className="font-medium text-white">Disk Health Check</h4>
                      <p className="text-sm text-slate-400">Minor issues detected</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">1 day ago</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div>
                      <h4 className="font-medium text-white">Network Diagnostics</h4>
                      <p className="text-sm text-slate-400">All tests passed</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
