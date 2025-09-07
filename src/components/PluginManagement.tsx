import { useState, useEffect } from 'react'
import { Plugin, Download, Trash2, Settings, Play, Pause, Star, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockApiService, mockPlugins } from '@/services/mockData'

/**
 * PluginManagement component for managing extensions and custom modules
 * Provides interface for browsing, installing, and configuring plugins
 */

interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  installed: boolean
  enabled: boolean
  category: 'analysis' | 'system' | 'ai' | 'utility'
  downloads?: number
  rating?: number
  lastUpdated?: string
}

export default function PluginManagement() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [marketplacePlugins, setMarketplacePlugins] = useState<Plugin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadPlugins()
    loadMarketplacePlugins()
  }, [])

  const loadPlugins = async () => {
    setIsLoading(true)
    try {
      const response = await mockApiService.getPlugins()
      if (response.success && response.data) {
        setPlugins(response.data)
      }
    } catch (error) {
      console.error('Failed to load plugins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMarketplacePlugins = () => {
    // Mock marketplace plugins
    const marketplace: Plugin[] = [
      {
        id: 'typescript-analyzer',
        name: 'TypeScript Analyzer',
        version: '2.3.0',
        description: 'Advanced TypeScript static analysis and type checking',
        author: 'TypeScript Team',
        installed: false,
        enabled: false,
        category: 'analysis',
        downloads: 15420,
        rating: 4.8,
        lastUpdated: '2024-01-10',
      },
      {
        id: 'performance-profiler',
        name: 'Performance Profiler',
        version: '1.8.0',
        description: 'Real-time application performance monitoring and profiling',
        author: 'Performance Tools Inc',
        installed: false,
        enabled: false,
        category: 'system',
        downloads: 8930,
        rating: 4.6,
        lastUpdated: '2024-01-08',
      },
      {
        id: 'security-scanner',
        name: 'Security Scanner',
        version: '3.1.0',
        description: 'Automated security vulnerability detection and analysis',
        author: 'Security Labs',
        installed: false,
        enabled: false,
        category: 'analysis',
        downloads: 12350,
        rating: 4.9,
        lastUpdated: '2024-01-12',
      },
      {
        id: 'ml-code-completion',
        name: 'ML Code Completion',
        version: '0.5.0',
        description: 'Machine learning powered code completion and suggestions',
        author: 'AI Research Team',
        installed: false,
        enabled: false,
        category: 'ai',
        downloads: 6780,
        rating: 4.3,
        lastUpdated: '2024-01-05',
      },
      {
        id: 'git-integration',
        name: 'Git Integration',
        version: '2.0.0',
        description: 'Seamless Git repository management and integration',
        author: 'Git Tools',
        installed: false,
        enabled: false,
        category: 'utility',
        downloads: 18900,
        rating: 4.7,
        lastUpdated: '2024-01-15',
      },
    ]
    setMarketplacePlugins(marketplace)
  }

  const handleInstallPlugin = async (pluginId: string) => {
    try {
      const response = await mockApiService.installPlugin(pluginId)
      if (response.success) {
        // Update plugin status
        setPlugins(prev => prev.map(p => 
          p.id === pluginId ? { ...p, installed: true, enabled: true } : p
        ))
        setMarketplacePlugins(prev => prev.map(p => 
          p.id === pluginId ? { ...p, installed: true, enabled: true } : p
        ))
      }
    } catch (error) {
      console.error('Failed to install plugin:', error)
    }
  }

  const handleUninstallPlugin = async (pluginId: string) => {
    try {
      const response = await mockApiService.uninstallPlugin(pluginId)
      if (response.success) {
        // Update plugin status
        setPlugins(prev => prev.map(p => 
          p.id === pluginId ? { ...p, installed: false, enabled: false } : p
        ))
        setMarketplacePlugins(prev => prev.map(p => 
          p.id === pluginId ? { ...p, installed: false, enabled: false } : p
        ))
      }
    } catch (error) {
      console.error('Failed to uninstall plugin:', error)
    }
  }

  const handleTogglePlugin = (pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, enabled: !p.enabled } : p
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analysis': return 'bg-blue-600'
      case 'system': return 'bg-green-600'
      case 'ai': return 'bg-purple-600'
      case 'utility': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  const filteredPlugins = selectedCategory === 'all' 
    ? plugins 
    : plugins.filter(p => p.category === selectedCategory)

  const filteredMarketplacePlugins = selectedCategory === 'all' 
    ? marketplacePlugins 
    : marketplacePlugins.filter(p => p.category === selectedCategory)

  const renderPluginCard = (plugin: Plugin, isInstalled: boolean) => (
    <Card key={plugin.id} className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white flex items-center">
              <Plugin className="h-5 w-5 mr-2 text-blue-400" />
              {plugin.name}
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              {plugin.description}
            </CardDescription>
          </div>
          <Badge className={`${getCategoryColor(plugin.category)} text-white`}>
            {plugin.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Version:</span>
            <span className="text-white">{plugin.version}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Author:</span>
            <span className="text-white">{plugin.author}</span>
          </div>
          
          {plugin.rating && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Rating:</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white">{plugin.rating}</span>
              </div>
            </div>
          )}
          
          {plugin.downloads && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Downloads:</span>
              <span className="text-white">{plugin.downloads.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {isInstalled && plugin.installed && (
                <Badge className={plugin.enabled ? 'bg-green-600' : 'bg-gray-600'}>
                  {plugin.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              )}
              {plugin.installed && (
                <Badge variant="outline" className="border-green-600 text-green-400">
                  Installed
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {plugin.installed ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePlugin(plugin.id)}
                    className="bg-transparent border-slate-600"
                  >
                    {plugin.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUninstallPlugin(plugin.id)}
                    className="bg-transparent border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleInstallPlugin(plugin.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Install
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-slate-600"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Plugin className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Plugin Management</h2>
          <p className="text-slate-400">Manage extensions and custom modules</p>
        </div>
      </div>

      <Tabs defaultValue="installed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
          <TabsTrigger value="installed" className="data-[state=active]:bg-slate-700">
            Installed Plugins ({plugins.filter(p => p.installed).length})
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-slate-700">
            Plugin Marketplace ({marketplacePlugins.length})
          </TabsTrigger>
        </TabsList>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Filter by category:</span>
          <div className="flex space-x-2">
            {['all', 'analysis', 'system', 'ai', 'utility'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Installed Plugins Tab */}
        <TabsContent value="installed" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading plugins...</p>
            </div>
          ) : filteredPlugins.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="text-center py-8">
                <Plugin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No plugins found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlugins.filter(p => p.installed).map(plugin => 
                renderPluginCard(plugin, true)
              )}
            </div>
          )}
        </TabsContent>

        {/* Plugin Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Plugin Marketplace</CardTitle>
              <CardDescription className="text-slate-400">
                Browse and install community-created plugins to extend functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse All Plugins
                </Button>
                <Button variant="outline" className="bg-transparent border-slate-600">
                  <Star className="h-4 w-4 mr-2" />
                  Top Rated
                </Button>
                <Button variant="outline" className="bg-transparent border-slate-600">
                  <Download className="h-4 w-4 mr-2" />
                  Most Popular
                </Button>
              </div>
            </CardContent>
          </Card>

          {filteredMarketplacePlugins.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="text-center py-8">
                <Plugin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No plugins found in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarketplacePlugins.map(plugin => 
                renderPluginCard(plugin, false)
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
