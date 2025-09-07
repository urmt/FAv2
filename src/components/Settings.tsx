import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Download, Upload, Trash2, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { storageService, UserPreferences } from '@/services/storage'

/**
 * Settings component for managing user preferences and application configuration
 * Provides interface for customization, data management, and system preferences
 */

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>(storageService.getUserPreferences())
  const [isSaving, setIsSaving] = useState(false)
  const [storageSize, setStorageSize] = useState(0)

  useEffect(() => {
    setStorageSize(storageService.getStorageSize())
  }, [])

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      storageService.saveUserPreferences(preferences)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetPreferences = () => {
    const defaultPreferences: UserPreferences = {
      theme: 'dark',
      language: 'javascript',
      autoSave: true,
      notifications: true,
      telemetry: false,
    }
    setPreferences(defaultPreferences)
    storageService.saveUserPreferences(defaultPreferences)
  }

  const handleExportData = () => {
    const data = storageService.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cli-tool-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string
          const success = storageService.importData(jsonData)
          if (success) {
            setPreferences(storageService.getUserPreferences())
            alert('Settings imported successfully!')
          } else {
            alert('Failed to import settings. Please check the file format.')
          }
        } catch (error) {
          alert('Failed to import settings. Invalid file format.')
        }
      }
      reader.readAsText(file)
    }
    // Reset the input value so the same file can be selected again
    event.target.value = ''
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all settings and history? This action cannot be undone.')) {
      storageService.clearAllData()
      setPreferences(storageService.getUserPreferences())
      setStorageSize(0)
      alert('All data cleared successfully!')
    }
  }

  const formatStorageSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-slate-400">Manage preferences and application configuration</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-slate-700">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-slate-700">
            Data Management
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-slate-700">
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">General Preferences</CardTitle>
              <CardDescription className="text-slate-400">
                Basic application settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Default Language</h4>
                    <p className="text-sm text-slate-400">Preferred programming language for code generation</p>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="react">React</option>
                    <option value="bash">Bash</option>
                    <option value="html">HTML</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Auto Save</h4>
                    <p className="text-sm text-slate-400">Automatically save generated code and analysis results</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Notifications</h4>
                    <p className="text-sm text-slate-400">Enable system notifications and alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Telemetry</h4>
                    <p className="text-sm text-slate-400">Share anonymous usage data to improve the tool</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.telemetry}
                      onChange={(e) => setPreferences({ ...preferences, telemetry: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleResetPreferences}
                  variant="outline"
                  className="bg-transparent border-slate-600"
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription className="text-slate-400">
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-4">Theme</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        preferences.theme === 'dark'
                          ? 'border-blue-500 bg-slate-700'
                          : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-full h-16 bg-slate-900 rounded mb-2"></div>
                        <span className="text-white font-medium">Dark</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        preferences.theme === 'light'
                          ? 'border-blue-500 bg-slate-200'
                          : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-full h-16 bg-white border rounded mb-2"></div>
                        <span className="text-white font-medium">Light</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Data Management</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your data, history, and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Storage Usage</h4>
                    <p className="text-sm text-slate-400">Current local storage usage</p>
                  </div>
                  <Badge className="bg-blue-600">
                    {formatStorageSize(storageSize)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleExportData}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                  
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-settings"
                    />
                    <Button
                      onClick={() => document.getElementById('import-settings')?.click()}
                      variant="outline"
                      className="w-full bg-transparent border-slate-600"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Settings
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h4 className="font-medium text-white mb-4 text-red-400">Danger Zone</h4>
                  <Button
                    onClick={handleClearAllData}
                    variant="outline"
                    className="bg-transparent border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Advanced Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Advanced configuration and developer options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Application Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Version:</span>
                      <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Build:</span>
                      <span className="text-white">20240115.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Environment:</span>
                      <span className="text-white">Development</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Debug Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Storage Available:</span>
                      <span className="text-white">{formatStorageSize(5 * 1024 * 1024 - storageSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cache Status:</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">API Status:</span>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Experimental Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white">Local AI Models</h5>
                        <p className="text-xs text-slate-400">Enable experimental local AI processing</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white">Advanced Logging</h5>
                        <p className="text-xs text-slate-400">Enable detailed debug logging</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
