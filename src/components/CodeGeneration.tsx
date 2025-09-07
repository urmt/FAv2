
import { useState } from 'react'
import { FileText, Wand2, Copy, Download, Code, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * CodeGeneration component for generating code from natural language descriptions
 * Provides interface for AI-powered code generation and template-based creation
 */
interface GeneratedCode {
  id: string
  language: string
  code: string
  description: string
  timestamp: Date
}

interface LanguageTemplate {
  name: string
  extension: string
  icon: React.ReactNode
  color: string
}

export default function CodeGeneration() {
  const [prompt, setPrompt] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [recentGenerations, setRecentGenerations] = useState<GeneratedCode[]>([])
  const [copied, setCopied] = useState(false)

  const languages: LanguageTemplate[] = [
    { name: 'JavaScript', extension: 'js', icon: <Code className="h-4 w-4" />, color: 'text-yellow-400' },
    { name: 'Python', extension: 'py', icon: <Code className="h-4 w-4" />, color: 'text-blue-400' },
    { name: 'TypeScript', extension: 'ts', icon: <Code className="h-4 w-4" />, color: 'text-blue-600' },
    { name: 'React', extension: 'jsx', icon: <Code className="h-4 w-4" />, color: 'text-cyan-400' },
    { name: 'Bash', extension: 'sh', icon: <Code className="h-4 w-4" />, color: 'text-green-400' },
    { name: 'HTML', extension: 'html', icon: <Code className="h-4 w-4" />, color: 'text-orange-400' }
  ]

  const examplePrompts = [
    "Create a Python function to fetch API data",
    "Generate a React component for user login",
    "Write a bash script to backup files",
    "Create a JavaScript function to validate email",
    "Generate a TypeScript interface for user data",
    "Write a Python class for database connection"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    
    // Simulate code generation
    setTimeout(() => {
      const mockCode: GeneratedCode = {
        id: Date.now().toString(),
        language: selectedLanguage,
        code: generateMockCode(prompt, selectedLanguage),
        description: prompt,
        timestamp: new Date()
      }
      
      setGeneratedCode(mockCode)
      setRecentGenerations(prev => [mockCode, ...prev.slice(0, 4)])
      setIsGenerating(false)
    }, 2000)
  }

  const generateMockCode = (prompt: string, language: string): string => {
    const codeTemplates: Record<string, string> = {
      javascript: `// Generated JavaScript code for: ${prompt}
function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

// Usage example:
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
      
      python: `# Generated Python code for: ${prompt}
import requests
import json

def fetch_api_data(url):
    """
    Fetch data from API endpoint
    
    Args:
        url (str): API endpoint URL
        
    Returns:
        dict: JSON response data
        
    Raises:
        requests.RequestException: If request fails
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        raise

# Usage example:
if __name__ == "__main__":
    try:
        data = fetch_api_data("https://api.example.com/data")
        print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Failed to fetch data: {e}")`,
      
      react: `// Generated React component for: ${prompt}
import React, { useState } from 'react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Add your login logic here
      console.log('Login attempt:', { email, password });
      // await loginService.login(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;`,
      
      bash: `#!/bin/bash
# Generated bash script for: ${prompt}

# Configuration
SOURCE_DIR="/home/user/documents"
BACKUP_DIR="/home/user/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Start backup process
log_message "Starting backup process..."

# Create compressed archive
if tar -czf "$BACKUP_DIR/$BACKUP_NAME" "$SOURCE_DIR"; then
    log_message "Backup created successfully: $BACKUP_NAME"
    
    # Calculate backup size
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)
    log_message "Backup size: $BACKUP_SIZE"
    
    # Remove backups older than 7 days
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
    log_message "Cleaned up old backups"
    
    exit 0
else
    log_message "ERROR: Backup failed"
    exit 1
fi`,
      
      typescript: `// Generated TypeScript code for: ${prompt}
interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserResponse {
  success: boolean;
  data?: UserData;
  error?: string;
}

class UserService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }

  async getUser(id: string): Promise<UserResponse> {
    try {
      const response = await fetch(\`\${this.baseUrl}/users/\${id}\`);
      
      if (!response.ok) {
        return {
          success: false,
          error: \`HTTP error! status: \${response.status}\`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Usage example:
const userService = new UserService();
userService.getUser('123')
  .then(response => {
    if (response.success && response.data) {
      console.log('User:', response.data);
    } else {
      console.error('Error:', response.error);
    }
  });`,
      
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Generated Form</h1>
        <form id="generatedForm">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4"></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
    
    <script>
        document.getElementById('generatedForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully!');
        });
    </script>
</body>
</html>`
    }

    return codeTemplates[language] || `// Generated code for: ${prompt}\n// Language: ${language}\n// Code generation not available for this language yet.`
  }

  const copyToClipboard = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const downloadCode = () => {
    if (generatedCode) {
      const language = languages.find(l => l.name.toLowerCase() === generatedCode.language.toLowerCase())
      const extension = language?.extension || 'txt'
      const filename = `generated_code.${extension}`
      
      const blob = new Blob([generatedCode.code], { type: 'text/plain' })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Wand2 className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Code Generation</h2>
          <p className="text-slate-400">Generate code from natural language descriptions</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
          <TabsTrigger value="generate" className="data-[state=active]:bg-slate-700">
            Generate Code
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-slate-700">
            Recent Generations
          </TabsTrigger>
        </TabsList>

        {/* Generate Code Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Code</CardTitle>
              <CardDescription className="text-slate-400">
                Describe what you want to create in natural language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Programming Language:
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.name}
                      onClick={() => setSelectedLanguage(language.name.toLowerCase())}
                      className={\`px-3 py-2 rounded-lg border transition-colors \${
                        selectedLanguage === language.name.toLowerCase()
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                      }\`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={language.color}>{language.icon}</span>
                        <span>{language.name}</span>
                      </div>
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
                  placeholder="e.g., Create a Python function to fetch API data"
                  className="w-full h-24 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated Code</CardTitle>
                    <CardDescription className="text-slate-400">
                      {generatedCode.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-slate-700">
                      {languages.find(l => l.name.toLowerCase() === generatedCode.language)?.name || generatedCode.language}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="bg-transparent border-slate-600"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                  <code className="text-sm text-slate-300">{generatedCode.code}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Generations</CardTitle>
              <CardDescription className="text-slate-400">
                Your recently generated code snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentGenerations.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No code generated yet. Create your first code snippet!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentGenerations.map((generation) => (
                    <div key={generation.id} className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{generation.description}</h4>
                        <Badge className="bg-slate-700">
                          {languages.find(l => l.name.toLowerCase() === generation.language)?.name || generation.language}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {generation.timestamp.toLocaleString()}
                      </p>
                      <pre className="bg-slate-900 p-3 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-32">
                        {generation.code.substring(0, 200)}{generation.code.length > 200 ? '...' : ''}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
