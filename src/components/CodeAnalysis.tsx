
import { useState } from 'react'
import { Code, CheckCircle, AlertTriangle, XCircle, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

/**
 * CodeAnalysis component for static code analysis and linting
 * Provides interface for analyzing code quality, finding issues, and refactoring suggestions
 */
interface CodeIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  file: string
  line: number
  message: string
  severity: 'high' | 'medium' | 'low'
}

interface AnalysisResult {
  totalFiles: number
  totalLines: number
  issues: CodeIssue[]
  complexity: number
  maintainability: number
}

export default function CodeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<string>('')

  // Mock analysis data
  const mockAnalysis: AnalysisResult = {
    totalFiles: 24,
    totalLines: 1542,
    issues: [
      {
        id: '1',
        type: 'error',
        file: 'src/components/App.tsx',
        line: 45,
        message: 'Unused variable "unusedVar"',
        severity: 'low'
      },
      {
        id: '2',
        type: 'warning',
        file: 'src/utils/helpers.ts',
        line: 23,
        message: 'Function complexity too high',
        severity: 'medium'
      },
      {
        id: '3',
        type: 'error',
        file: 'src/services/api.ts',
        line: 67,
        message: 'Missing error handling',
        severity: 'high'
      }
    ],
    complexity: 7.2,
    maintainability: 82
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setAnalysisResult(mockAnalysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-600">High</Badge>
      case 'medium':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-400">Medium</Badge>
      case 'low':
        return <Badge variant="outline" className="border-green-600 text-green-400">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-400" />
            Code Analysis
          </CardTitle>
          <CardDescription className="text-slate-400">
            Analyze your codebase for quality issues, bugs, and improvement opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
            <Button variant="outline" className="bg-transparent border-slate-600">
              <FileText className="h-4 w-4 mr-2" />
              Configure Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Files Analyzed</span>
                <span className="text-white font-medium">{analysisResult.totalFiles}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Lines</span>
                <span className="text-white font-medium">{analysisResult.totalLines.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Issues Found</span>
                <span className="text-white font-medium">{analysisResult.issues.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Complexity Score</span>
                <span className={`font-medium ${analysisResult.complexity > 10 ? 'text-red-400' : analysisResult.complexity > 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {analysisResult.complexity}/10
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Maintainability</span>
                <span className={`font-medium ${analysisResult.maintainability > 80 ? 'text-green-400' : analysisResult.maintainability > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {analysisResult.maintainability}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Issues Breakdown */}
          <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                  <TabsTrigger value="all">All ({analysisResult.issues.length})</TabsTrigger>
                  <TabsTrigger value="errors">
                    Errors ({analysisResult.issues.filter(i => i.type === 'error').length})
                  </TabsTrigger>
                  <TabsTrigger value="warnings">
                    Warnings ({analysisResult.issues.filter(i => i.type === 'warning').length})
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    Info ({analysisResult.issues.filter(i => i.type === 'info').length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-3 mt-4">
                  {analysisResult.issues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{issue.message}</h4>
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-sm text-slate-400">
                            {issue.file}:{issue.line}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="errors" className="space-y-3 mt-4">
                  {analysisResult.issues.filter(i => i.type === 'error').map((issue) => (
                    <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{issue.message}</h4>
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-sm text-slate-400">
                            {issue.file}:{issue.line}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="warnings" className="space-y-3 mt-4">
                  {analysisResult.issues.filter(i => i.type === 'warning').map((issue) => (
                    <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{issue.message}</h4>
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-sm text-slate-400">
                            {issue.file}:{issue.line}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="info" className="space-y-3 mt-4">
                  {analysisResult.issues.filter(i => i.type === 'info').map((issue) => (
                    <div key={issue.id} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{issue.message}</h4>
                            {getSeverityBadge(issue.severity)}
                          </div>
                          <p className="text-sm text-slate-400">
                            {issue.file}:{issue.line}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refactoring Suggestions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Refactoring Suggestions</CardTitle>
          <CardDescription className="text-slate-400">
            AI-powered suggestions to improve code quality and maintainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Extract Complex Function</h4>
              <p className="text-sm text-slate-400 mb-3">
                The function in src/utils/helpers.ts is too complex. Consider extracting parts into smaller, focused functions.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Apply Refactoring
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Add Error Handling</h4>
              <p className="text-sm text-slate-400 mb-3">
                API calls in src/services/api.ts lack proper error handling. Add try-catch blocks.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Apply Refactoring
              </Button>
            </div>
            
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Remove Unused Code</h4>
              <p className="text-sm text-slate-400 mb-3">
                Found unused variables and imports that can be safely removed.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Apply Refactoring
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
