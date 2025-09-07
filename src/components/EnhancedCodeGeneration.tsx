import { useState, useEffect } from 'react'
import { Wand2, Brain, Cpu, Download, Copy, CheckCircle, AlertCircle, RefreshCw, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { localAIService, LocalAIModel, AIPrompt, AIResponse, CodeAnalysisResponse } from '@/services/aiService'

/**
 * EnhancedCodeGeneration component with real AI model integration
 * Provides advanced AI-powered code generation and analysis capabilities
 */

export default function EnhancedCodeGeneration() {
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<AIResponse | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)

  const languages = [
    { name: 'JavaScript', value: 'javascript', color: 'text-yellow-400' },
    { name: 'Python', value: 'python', color: 'text-blue-400' },
    { name: 'TypeScript', value: 'typescript', color: 'text-blue-600' },
    { name: 'React', value: 'react', color: 'text-cyan-400' },
    { name: 'Go', value: 'go', color: 'text-cyan-600' },
    { name: 'Rust', value: 'rust', color: 'text-orange-400' },
    { name: 'Java', value: 'java', color: 'text-red-400' },
    { name: 'C++', value: 'cpp', color: 'text-purple-400' },
    { name: 'Ruby', value: 'ruby', color: 'text-red-600' },
    { name: 'PHP', value: 'php', color: 'text-indigo-400' }
  ]

  const examplePrompts = [
    "Create a Python function to fetch API data with error handling",
    "Generate a React component for user authentication",
    "Write a Go function to process CSV files",
    "Create a Rust struct for user data with validation",
    "Generate a Java class for database connection pooling",
    "Write a Python decorator for timing function execution"
  ]

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = () => {
    const availableModels = aiService.getAvailableModels()
    setModels(availableModels)
    const defaultModel = aiService.getSelectedModel()
    setSelectedModel(defaultModel || availableModels[0])
  }

  const handleGenerateCode = async () => {
    if (!prompt.trim() || !selectedModel) return

    setIsGenerating(true)
    try {
      const aiPrompt: AIPrompt = {
        prompt,
        language,
        temperature,
        maxTokens: maxLength
      }
      
      const response = await localAIService.generateCode(aiPrompt)
      setGeneratedCode(response)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnalyzeCode = async () => {
    if (!generatedCode) return

    setIsAnalyzing(true)
    try {
      const response = await localAIService.analyzeCode(generatedCode.generated_code, language)
      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    aiService.setSelectedModel(modelId)
    const model = models.find(m => m.id === modelId)
    setSelectedModel(model || null)
  }

  const copyToClipboard = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode.content)
        // Show success feedback
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const downloadCode = () => {
    if (generatedCode) {
      const extension = languages.find(l => l.value === language)?.value || 'txt'
      const filename = `ai_generated_code.${extension}`
      
      const blob = new Blob([generatedCode.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'refactoring': return <RefreshCw className="h-4 w-4 text-blue-400" />
      case 'optimization': return <Cpu className="h-4 w-4 text-green-400" />
      case 'bugfix': return <AlertCircle className="h-4 w-4 text-red-400" />
      case 'documentation': return <Copy className="h-4 w-4 text-purple-400" />
      default: return <Brain className="h-4 w-4 text-gray-400" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-purple-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">AI-Powered Code Generation</h2>
          <p className="text-slate-400">Generate code using local AI models with advanced capabilities</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger value="generate" className="data-[state=active]:bg-slate-700">
            Generate Code
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-slate-700">
            AI Models
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Generate Code Tab */}
        <TabsContent value="generate" className="space-y-6">
          {/* AI Model Selection */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                AI Model Selection
              </CardTitle>
              <CardDescription className="text-slate-400">
                Choose the AI model for code generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedModel?.id === model.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{model.name}</h4>
                      <Badge className={
                        model.status === 'available' ? 'bg-green-600' :
                        model.status === 'loading' ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {model.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{model.description}</p>
                    <div className="text-xs text-slate-500">
                      Size: {model.size}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.capabilities.slice(0, 2).map((capability) => (
                        <Badge key={capability} variant="outline" className="text-xs border-slate-600">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Generation Interface */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Code</CardTitle>
              <CardDescription className="text-slate-400">
                Describe what you want to create using natural language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Programming Language:
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        language === lang.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Describe what you want to create:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a Python function to fetch API data with error handling"
                  className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Example Prompts */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Example prompts:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="text-left p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateCode}
                disabled={!prompt.trim() || isGenerating || !selectedModel}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating with {selectedModel?.name}...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Code Display */}
          {generatedCode && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Generated Code</CardTitle>
                      <CardDescription className="text-slate-400">
                        {generatedCode.model} • {generatedCode.processingTime}ms • {generatedCode.tokensUsed} tokens
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="bg-transparent border-slate-600"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadCode}
                        className="bg-transparent border-slate-600"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-slate-300">{generatedCode.content}</code>
                  </pre>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">AI Analysis</CardTitle>
                    <Button
                      size="sm"
                      onClick={handleAnalyzeCode}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Brain className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            {getSuggestionIcon(suggestion.type)}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-white text-sm">{suggestion.description}</h4>
                                <span className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                                  {Math.round(suggestion.confidence * 100)}% confidence
                                </span>
                              </div>
                              <pre className="bg-slate-900 p-2 rounded text-xs text-slate-300 mt-2 overflow-x-auto">
                                {suggestion.code}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        {isAnalyzing ? 'Analyzing code...' : 'Click analyze to get AI suggestions'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* AI Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Available AI Models</CardTitle>
              <CardDescription className="text-slate-400">
                Manage and monitor your local AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{model.name}</h4>
                        <p className="text-sm text-slate-400">{model.description}</p>
                      </div>
                      <Badge className={
                        model.status === 'available' ? 'bg-green-600' :
                        model.status === 'loading' ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {model.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Size:</span>
                        <span className="text-white ml-2">{model.size}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Capabilities:</span>
                        <span className="text-white ml-2">{model.capabilities.length}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Selected:</span>
                        <span className="text-white ml-2">
                          {selectedModel?.id === model.id ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => handleModelChange(model.id)}
                          variant={selectedModel?.id === model.id ? "default" : "outline"}
                          className={selectedModel?.id === model.id ? "bg-purple-600" : "bg-transparent border-slate-600"}
                        >
                          {selectedModel?.id === model.id ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Generation Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure AI model parameters and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Temperature: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Controls randomness: Lower = more focused, Higher = more creative
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Maximum length of generated code
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h4 className="font-medium text-white mb-3">Advanced Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white">Auto-analyze generated code</h5>
                      <p className="text-xs text-slate-400">Automatically analyze code after generation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white">Include comments in generated code</h5>
                      <p className="text-xs text-slate-400">Add explanatory comments to generated code</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
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
