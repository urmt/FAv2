/**
 * Local storage service for data persistence
 * Handles user preferences, history, and cached data
 */

export interface UserPreferences {
  theme: 'dark' | 'light'
  language: string
  autoSave: boolean
  notifications: boolean
  telemetry: boolean
}

export interface CodeGenerationHistory {
  id: string
  prompt: string
  language: string
  code: string
  timestamp: Date
  favorited: boolean
}

export interface AnalysisHistory {
  id: string
  projectPath: string
  timestamp: Date
  issuesFound: number
  filesAnalyzed: number
  complexity: number
  maintainability: number
}

export interface PluginSettings {
  [pluginId: string]: {
    enabled: boolean
    config: Record<string, any>
  }
}

const STORAGE_KEYS = {
  USER_PREFERENCES: 'cli_tool_user_preferences',
  CODE_GENERATION_HISTORY: 'cli_tool_code_history',
  ANALYSIS_HISTORY: 'cli_tool_analysis_history',
  PLUGIN_SETTINGS: 'cli_tool_plugin_settings',
  SYSTEM_METRICS_CACHE: 'cli_tool_metrics_cache',
} as const

class StorageService {
  // User Preferences
  getUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
    
    // Default preferences
    return {
      theme: 'dark',
      language: 'javascript',
      autoSave: true,
      notifications: true,
      telemetry: false,
    }
  }

  saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save user preferences:', error)
    }
  }

  // Code Generation History
  getCodeGenerationHistory(): CodeGenerationHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CODE_GENERATION_HISTORY)
      if (stored) {
        const history = JSON.parse(stored)
        return history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to load code generation history:', error)
    }
    return []
  }

  saveCodeGeneration(entry: Omit<CodeGenerationHistory, 'id' | 'timestamp'>): string {
    try {
      const history = this.getCodeGenerationHistory()
      const newEntry: CodeGenerationHistory = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      
      history.unshift(newEntry)
      
      // Keep only last 50 entries
      if (history.length > 50) {
        history.splice(50)
      }
      
      localStorage.setItem(STORAGE_KEYS.CODE_GENERATION_HISTORY, JSON.stringify(history))
      return newEntry.id
    } catch (error) {
      console.error('Failed to save code generation history:', error)
      return ''
    }
  }

  deleteCodeGeneration(id: string): void {
    try {
      const history = this.getCodeGenerationHistory()
      const filtered = history.filter(entry => entry.id !== id)
      localStorage.setItem(STORAGE_KEYS.CODE_GENERATION_HISTORY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete code generation entry:', error)
    }
  }

  toggleFavoriteCodeGeneration(id: string): void {
    try {
      const history = this.getCodeGenerationHistory()
      const entry = history.find(h => h.id === id)
      if (entry) {
        entry.favorited = !entry.favorited
        localStorage.setItem(STORAGE_KEYS.CODE_GENERATION_HISTORY, JSON.stringify(history))
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  // Analysis History
  getAnalysisHistory(): AnalysisHistory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY)
      if (stored) {
        const history = JSON.parse(stored)
        return history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error)
    }
    return []
  }

  saveAnalysisHistory(entry: Omit<AnalysisHistory, 'id' | 'timestamp'>): string {
    try {
      const history = this.getAnalysisHistory()
      const newEntry: AnalysisHistory = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      
      history.unshift(newEntry)
      
      // Keep only last 20 entries
      if (history.length > 20) {
        history.splice(20)
      }
      
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history))
      return newEntry.id
    } catch (error) {
      console.error('Failed to save analysis history:', error)
      return ''
    }
  }

  // Plugin Settings
  getPluginSettings(): PluginSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLUGIN_SETTINGS)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load plugin settings:', error)
    }
    return {}
  }

  savePluginSettings(settings: PluginSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLUGIN_SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save plugin settings:', error)
    }
  }

  updatePluginSetting(pluginId: string, enabled: boolean, config: Record<string, any> = {}): void {
    try {
      const settings = this.getPluginSettings()
      settings[pluginId] = { enabled, config }
      this.savePluginSettings(settings)
    } catch (error) {
      console.error('Failed to update plugin setting:', error)
    }
  }

  // System Metrics Cache
  getSystemMetricsCache(): any {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYSTEM_METRICS_CACHE)
      if (stored) {
        const cached = JSON.parse(stored)
        // Check if cache is still valid (less than 5 minutes old)
        const now = Date.now()
        if (now - cached.timestamp < 5 * 60 * 1000) {
          return cached.data
        }
      }
    } catch (error) {
      console.error('Failed to load system metrics cache:', error)
    }
    return null
  }

  saveSystemMetricsCache(data: any): void {
    try {
      const cache = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(STORAGE_KEYS.SYSTEM_METRICS_CACHE, JSON.stringify(cache))
    } catch (error) {
      console.error('Failed to save system metrics cache:', error)
    }
  }

  // Utility methods
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }

  exportData(): string {
    try {
      const data: Record<string, any> = {}
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key)
        if (value) {
          data[key] = JSON.parse(value)
        }
      })
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Failed to export data:', error)
      return '{}'
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  getStorageSize(): number {
    try {
      let total = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && Object.values(STORAGE_KEYS).includes(key as any)) {
          const value = localStorage.getItem(key)
          if (value) {
            total += key.length + value.length
          }
        }
      }
      return total
    } catch (error) {
      console.error('Failed to calculate storage size:', error)
      return 0
    }
  }
}

export const storageService = new StorageService()
export default StorageService
