
import { useState } from 'react'
import { Link } from 'react-router'
import { Code, Monitor, Settings, Plugin, FileText, BarChart3, Activity, Terminal, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * Home page component for the Local CLI Tool Dashboard
 * Provides navigation to different modules and overview of system status
 */
export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Local CLI Tool</h1>
                <p className="text-sm text-slate-400">Code Analysis & OS Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="outline" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                System Status
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="code-analysis" className="data-[state=active]:bg-slate-700">
              <Code className="h-4 w-4 mr-2" />
              Code Analysis
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              <Monitor className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="plugins" className="data-[state=active]:bg-slate-700">
              <Plugin className="h-4 w-4 mr-2" />
              Plugins
            </TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Docs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">CPU Usage</CardTitle>
                  <Activity className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35%</div>
                  <p className="text-xs text-slate-400">Normal</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Memory</CardTitle>
                  <Activity className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-slate-400">Warning</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Disk Space</CardTitle>
                  <Activity className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">80%</div>
                  <p className="text-xs text-slate-400">Critical</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Issues</CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-slate-400">Requires Attention</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">
                    Common tasks and system operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <Code className="h-4 w-4 mr-2" />
                    Analyze Current Project
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <Monitor className="h-4 w-4 mr-2" />
                    Run System Diagnostics
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Code from Prompt
                  </Button>
                  <Button className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                    <Activity className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">
                    Latest system and code analysis events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Code analysis completed</p>
                      <p className="text-xs text-slate-400">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Memory usage warning</p>
                      <p className="text-xs text-slate-400">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Plugin updated: Python Linter</p>
                      <p className="text-xs text-slate-400">1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Code Analysis Tab */}
          <TabsContent value="code-analysis" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Code Analysis Module</CardTitle>
                <CardDescription className="text-slate-400">
                  Static analysis, linting, and automated refactoring tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/code-analysis">
                    <Button className="h-20 w-full flex-col bg-slate-700 hover:bg-slate-600">
                      <Code className="h-6 w-6 mb-2" />
                      Static Analysis
                    </Button>
                  </Link>
                  <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
                    <FileText className="h-6 w-6 mb-2" />
                    Code Refactoring
                  </Button>
                  <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
                    <Activity className="h-6 w-6 mb-2" />
                    Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor system resources and manage processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/system">
                    <Button className="h-20 w-full flex-col bg-slate-700 hover:bg-slate-600">
                      <Monitor className="h-6 w-6 mb-2" />
                      System Monitoring
                    </Button>
                  </Link>
                  <Button className="h-20 flex-col bg-slate-700 hover:bg-slate-600">
                    <Activity className="h-6 w-6 mb-2" />
                    Process Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Code Generation</CardTitle>
                <CardDescription className="text-slate-400">
                  Generate code from natural language descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example Prompts:</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• "Create a Python function to fetch API data"</li>
                      <li>• "Generate a React component for user login"</li>
                      <li>• "Write a bash script to backup files"</li>
                    </ul>
                  </div>
                  <Link to="/generate">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Open Code Generator
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plugins Tab */}
          <TabsContent value="plugins" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Plugin Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage extensions and custom modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">Python Linter</h4>
                      <p className="text-sm text-slate-400 mb-2">Advanced Python code analysis</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-green-600 px-2 py-1 rounded">Active</span>
                        <Button size="sm" variant="outline" className="bg-transparent border-slate-600">Configure</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">System Monitor</h4>
                      <p className="text-sm text-slate-400 mb-2">Real-time system metrics</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-green-600 px-2 py-1 rounded">Active</span>
                        <Button size="sm" variant="outline" className="bg-transparent border-slate-600">Configure</Button>
                      </div>
                    </div>
                  </div>
                  <Link to="/plugins">
                    <Button className="w-full bg-slate-700 hover:bg-slate-600">
                      <Plugin className="h-4 w-4 mr-2" />
                      Browse Plugin Marketplace
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docs Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Documentation</CardTitle>
                <CardDescription className="text-slate-400">
                  Command reference and usage guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">Getting Started</h4>
                      <p className="text-sm text-slate-400">Learn the basics and first steps</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">Command Reference</h4>
                      <p className="text-sm text-slate-400">Complete command documentation</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">API Documentation</h4>
                      <p className="text-sm text-slate-400">Plugin development guide</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-medium mb-2">Troubleshooting</h4>
                      <p className="text-sm text-slate-400">Common issues and solutions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
