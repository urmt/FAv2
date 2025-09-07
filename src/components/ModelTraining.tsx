/**
 * ModelTraining component for fine-tuning and custom training of AI models
 * Provides interface for model training, dataset management, and training monitoring
 */

import { useState, useEffect } from 'react'
import { Brain, Upload, Play, Pause, BarChart3, Settings, Download, Trash2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { localAIService } from '@/services/aiService'

interface TrainingJob {
  id: string
  model_name: string
  dataset_path: string
  status: 'pending' | 'training' | 'completed' | 'failed' | 'paused'
  progress: number
  epochs: number
  current_epoch: number
  loss: number
  accuracy?: number
  start_time: Date
  end_time?: Date
  config: TrainingConfig
}

interface TrainingConfig {
  learning_rate: number
  batch_size: number
  epochs: number
  validation_split: number
  early_stopping: boolean
  save_best_model: boolean
  quantization_after_training: boolean
}

interface Dataset {
  id: string
  name: string
  description: string
  file_count: number
  total_size: string
  languages: string[]
  created_at: Date
  status: 'ready' | 'processing' | 'error'
}

export default function ModelTraining() {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([])
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isTraining, setIsTraining] = useState(false)
  const [systemResources, setSystemResources] = useState<any>(null)

  useEffect(() => {
    loadTrainingJobs()
    loadDatasets()
    loadSystemResources()
  }, [])

  const loadTrainingJobs = () => {
    // Mock training jobs data
    const mockJobs: TrainingJob[] = [
      {
        id: '1',
        model_name: 'distilgpt2-code',
        dataset_path: '/datasets/python-code',
        status: 'completed',
        progress: 100,
        epochs: 10,
        current_epoch: 10,
        loss: 0.234,
        accuracy: 0.892,
        start_time: new Date('2024-01-15T10:00:00'),
        end_time: new Date('2024-01-15T14:30:00'),
        config: {
          learning_rate: 0.0001,
          batch_size: 16,
          epochs: 10,
          validation_split: 0.2,
          early_stopping: true,
          save_best_model: true,
          quantization_after_training: true
        }
      },
      {
        id: '2',
        model_name: 'tinyllama',
        dataset_path: '/datasets/multi-language',
        status: 'training',
        progress: 65,
        epochs: 15,
        current_epoch: 10,
        loss: 0.456,
        start_time: new Date('2024-01-16T09:00:00'),
        config: {
          learning_rate: 0.00005,
          batch_size: 8,
          epochs: 15,
          validation_split: 0.15,
          early_stopping: true,
          save_best_model: true,
          quantization_after_training: false
        }
      }
    ]
    setTrainingJobs(mockJobs)
  }

  const loadDatasets = () => {
    // Mock datasets data
    const mockDatasets: Dataset[] = [
      {
        id: '1',
        name: 'Python Code Dataset',
        description: 'Collection of Python scripts and functions for code generation',
        file_count: 15420,
        total_size: '2.3 GB',
        languages: ['python'],
        created_at: new Date('2024-01-10T10:00:00'),
        status: 'ready'
      },
      {
        id: '2',
        name: 'Multi-Language Code',
        description: 'Code samples in JavaScript, Python, Java, and C++',
        file_count: 8765,
        total_size: '1.8 GB',
        languages: ['javascript', 'python', 'java', 'cpp'],
        created_at: new Date('2024-01-12T14:30:00'),
        status: 'ready'
      },
      {
        id: '3',
        name: 'Web Development Code',
        description: 'HTML, CSS, and JavaScript code for web development',
        file_count: 6543,
        total_size: '1.2 GB',
        languages: ['html', 'css', 'javascript'],
        created_at: new Date('2024-01-14T16:45:00'),
        status: 'processing'
      }
    ]
    setDatasets(mockDatasets)
  }

  const loadSystemResources = () => {
    // Mock system resources
    setSystemResources({
      cpu_usage: 45,
      memory_usage: 72,
      gpu_usage: 68,
      disk_usage: 65,
      gpu_memory_used: 8.2,
      gpu_memory_total: 12.0
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600'
      case 'training': return 'bg-blue-600'
      case 'pending': return 'bg-yellow-600'
      case 'failed': return 'bg-red-600'
      case 'paused': return 'bg-gray-600'
      default: return 'bg-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'training': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'paused': return <Pause className="h-4 w-4 text-gray-400" />
      default: return <Play className="h-4 w-4 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleStartTraining = async (modelId: string, datasetId: string, config: TrainingConfig) => {
    setIsTraining(true)
    try {
      // Simulate training start
      const newJob: TrainingJob = {
        id: Date.now().toString(),
        model_name: modelId,
        dataset_path: `/datasets/${datasetId}`,
        status: 'training',
        progress: 0,
        epochs: config.epochs,
        current_epoch: 0,
        loss: 1.0,
        start_time: new Date(),
        config
      }
      
      setTrainingJobs(prev => [newJob, ...prev])
      
      // Simulate training progress
      const interval = setInterval(() => {
        setTrainingJobs(prev => prev.map(job => {
          if (job.id === newJob.id && job.status === 'training') {
            const progress = Math.min(100, job.progress + Math.random() * 10)
            const current_epoch = Math.min(config.epochs, job.current_epoch + 1)
            const loss = Math.max(0.1, job.loss - Math.random() * 0.1)
            
            return {
              ...job,
              progress,
              current_epoch,
              loss,
              accuracy: job.accuracy ? Math.min(1.0, (job.accuracy || 0.5) + Math.random() * 0.05) : undefined
            }
          }
          return job
        }))
        
        // Check if training is complete
        const currentJob = trainingJobs.find(j => j.id === newJob.id)
        if (currentJob && currentJob.progress >= 100) {
          clearInterval(interval)
          setTrainingJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { ...job, status: 'completed', end_time: new Date() }
              : job
          ))
          setIsTraining(false)
        }
      }, 2000)
      
    } catch (error) {
      console.error('Failed to start training:', error)
      setIsTraining(false)
    }
  }

  const handlePauseTraining = (jobId: string) => {
    setTrainingJobs(prev => prev.map(job => 
      job.id === jobId && job.status === 'training'
        ? { ...job, status: 'paused' }
        : job
    ))
  }

  const handleResumeTraining = (jobId: string) => {
    setTrainingJobs(prev => prev.map(job => 
      job.id === jobId && job.status === 'paused'
        ? { ...job, status: 'training' }
        : job
    ))
  }

  const handleDeleteJob = (jobId: string) => {
    setTrainingJobs(prev => prev.filter(job => job.id !== jobId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Model Training</h2>
            <p className="text-slate-400">Fine-tune and train custom AI models</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadTrainingJobs} className="bg-transparent border-slate-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger value="training" className="data-[state=active]:bg-slate-700">
            Training Jobs
          </TabsTrigger>
          <TabsTrigger value="datasets" className="data-[state=active]:bg-slate-700">
            Datasets
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-slate-700">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">
            Monitoring
          </TabsTrigger>
        </TabsList>

        {/* Training Jobs Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Active Training Jobs</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage model training processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trainingJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No training jobs found. Start a new training job!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trainingJobs.map((job) => (
                    <div key={job.id} className="p-4 bg-slate-700/50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(job.status)}
                            <h4 className="font-medium text-white">{job.model_name}</h4>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">
                            Dataset: {job.dataset_path}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.status === 'training' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePauseTraining(job.id)}
                              className="bg-transparent border-slate-600"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          )}
                          {job.status === 'paused' && (
                            <Button
                              size="sm"
                              onClick={() => handleResumeTraining(job.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job.id)}
                            className="bg-transparent border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Progress:</span>
                          <div className="mt-1">
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-white mt-1">{job.progress.toFixed(1)}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Epoch:</span>
                          <span className="text-white block mt-1">
                            {job.current_epoch}/{job.epochs}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-slate-400">Loss:</span>
                          <span className="text-white block mt-1">
                            {job.loss.toFixed(4)}
                          </span>
                        </div>
                        
                        {job.accuracy && (
                          <div>
                            <span className="text-slate-400">Accuracy:</span>
                            <span className="text-white block mt-1">
                              {(job.accuracy * 100).toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Started: {job.start_time.toLocaleString()}</span>
                          {job.end_time && (
                            <span>Ended: {job.end_time.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Training Datasets</CardTitle>
              <CardDescription className="text-slate-400">
                Manage datasets for model training and fine-tuning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{dataset.name}</h4>
                        <p className="text-sm text-slate-400">{dataset.description}</p>
                      </div>
                      <Badge className={
                        dataset.status === 'ready' ? 'bg-green-600' :
                        dataset.status === 'processing' ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {dataset.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Files:</span>
                        <span className="text-white block mt-1">
                          {dataset.file_count.toLocaleString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-slate-400">Size:</span>
                        <span className="text-white block mt-1">
                          {dataset.total_size}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-slate-400">Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dataset.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs border-slate-600">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-slate-400">Created:</span>
                        <span className="text-white block mt-1">
                          {dataset.created_at.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Training Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Configure training parameters and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Model Selection</h4>
                  <div className="space-y-2">
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="">Select a model...</option>
                      <option value="codebert-small">CodeBERT Small</option>
                      <option value="distilgpt2-code">DistilGPT2 Code</option>
                      <option value="tinyllama">TinyLLaMA</option>
                      <option value="starcoderbase">StarCoder Base</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Training Parameters</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Learning Rate</label>
                      <input 
                        type="number" 
                        step="0.00001"
                        min="0.00001"
                        max="0.001"
                        defaultValue="0.0001"
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Batch Size</label>
                      <select className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-slate-300 mb-1 block">Epochs</label>
                      <input 
                        type="number" 
                        min="1"
                        max="100"
                        defaultValue="10"
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Advanced Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Early Stopping</h5>
                        <p className="text-xs text-slate-400">Stop training when validation loss stops improving</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Save Best Model</h5>
                        <p className="text-xs text-slate-400">Save the model with best validation performance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-white text-sm">Quantization After Training</h5>
                        <p className="text-xs text-slate-400">Apply 4-bit quantization to reduce model size</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <Button 
                  onClick={() => handleStartTraining(selectedModel, '1', {
                    learning_rate: 0.0001,
                    batch_size: 16,
                    epochs: 10,
                    validation_split: 0.2,
                    early_stopping: true,
                    save_best_model: true,
                    quantization_after_training: true
                  })}
                  disabled={!selectedModel || isTraining}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isTraining ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Starting Training...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
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
                  Training Load
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Memory
                </CardTitle>
                <Brain className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.memory_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  RAM Usage
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  GPU Usage
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.gpu_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  VRAM: {systemResources?.gpu_memory_used?.toFixed(1) || 0}/{systemResources?.gpu_memory_total || 0} GB
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Disk Space
                </CardTitle>
                <Upload className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {systemResources?.disk_usage || 0}%
                </div>
                <p className="text-xs text-slate-400">
                  Available for Models
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Training Performance</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time training metrics and system performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Training Recommendations</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div>
                        <h5 className="text-white text-sm">Optimal Batch Size Detected</h5>
                        <p className="text-slate-400 text-sm">
                          Current batch size of 16 is optimal for your hardware configuration
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h5 className="text-white text-sm">High Memory Usage</h5>
                        <p className="text-slate-400 text-sm">
                          Consider reducing batch size or closing other applications during training
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h5 className="text-white text-sm">GPU Utilization Good</h5>
                        <p className="text-slate-400 text-sm">
                          GPU is being utilized efficiently for training operations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="bg-transparent border-slate-600">
                      <Download className="h-4 w-4 mr-2" />
                      Export Model
                    </Button>
                    <Button variant="outline" className="bg-transparent border-slate-600">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" className="bg-transparent border-slate-600">
                      <Settings className="h-4 w-4 mr-2" />
                      Adjust Config
                    </Button>
                    <Button variant="outline" className="bg-transparent border-slate-600">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart Training
                    </Button>
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
