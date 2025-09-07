/**
 * Performance Service for caching, lazy loading, and performance monitoring
 * Provides optimization utilities for better application performance
 */

export interface PerformanceMetrics {
  componentLoadTime: number
  apiResponseTime: number
  memoryUsage: number
  cacheHitRate: number
  timestamp: Date
}

export interface CacheEntry<T> {
  data: T
  timestamp: Date
  ttl: number // Time to live in milliseconds
  hits: number
}

export interface LazyComponentConfig {
  componentPath: string
  loadingComponent?: React.ComponentType
  errorComponent?: React.ComponentType
  preload?: boolean
}

class PerformanceService {
  private cache = new Map<string, CacheEntry<any>>()
  private metrics: PerformanceMetrics[] = []
  private observers: ((metrics: PerformanceMetrics) => void)[] = []

  // Cache Management
  setCache<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl,
      hits: 0
    })
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if entry is expired
    const now = new Date()
    const age = now.getTime() - entry.timestamp.getTime()
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    // Update hit count
    entry.hits++
    return entry.data
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      // Clear all cache
      this.cache.clear()
    }
  }

  getCacheStats(): { size: number; entries: Array<{ key: string; hits: number; age: number }> } {
    const entries: Array<{ key: string; hits: number; age: number }> = []
    const now = new Date()
    
    for (const [key, entry] of this.cache) {
      const age = now.getTime() - entry.timestamp.getTime()
      entries.push({ key, hits: entry.hits, age })
    }
    
    return {
      size: this.cache.size,
      entries
    }
  }

  // Performance Monitoring
  startMeasure(label: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.recordMetric({
        componentLoadTime: duration,
        apiResponseTime: 0,
        memoryUsage: this.getMemoryUsage(),
        cacheHitRate: this.getCacheHitRate(),
        timestamp: new Date()
      })
    }
  }

  recordMetric(metric: Partial<PerformanceMetrics>): void {
    const fullMetric: PerformanceMetrics = {
      componentLoadTime: 0,
      apiResponseTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      timestamp: new Date(),
      ...metric
    }
    
    this.metrics.push(fullMetric)
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
    
    // Notify observers
    this.observers.forEach(observer => observer(fullMetric))
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {}
    
    const sum = this.metrics.reduce((acc, metric) => ({
      componentLoadTime: acc.componentLoadTime + metric.componentLoadTime,
      apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      cacheHitRate: acc.cacheHitRate + metric.cacheHitRate
    }), {
      componentLoadTime: 0,
      apiResponseTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0
    })
    
    const count = this.metrics.length
    return {
      componentLoadTime: sum.componentLoadTime / count,
      apiResponseTime: sum.apiResponseTime / count,
      memoryUsage: sum.memoryUsage / count,
      cacheHitRate: sum.cacheHitRate / count
    }
  }

  // Observer pattern for real-time monitoring
  subscribe(observer: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(observer)
    
    return () => {
      const index = this.observers.indexOf(observer)
      if (index > -1) {
        this.observers.splice(index, 1)
      }
    }
  }

  // Utility methods
  private getMemoryUsage(): number {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
    }
    return 0
  }

  private getCacheHitRate(): number {
    if (this.cache.size === 0) return 0
    
    const totalHits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0)
    const totalRequests = totalHits + (this.cache.size * 2) // Estimate misses
    return totalRequests > 0 ? totalHits / totalRequests : 0
  }

  // Lazy Loading Utilities
  createLazyComponent<T>(config: LazyComponentConfig): React.ComponentType<T> {
    const loadComponent = () => {
      return import(/* @vite-ignore */ config.componentPath)
        .then(module => module.default)
        .catch(error => {
          console.error('Failed to load lazy component:', error)
          if (config.errorComponent) {
            return config.errorComponent
          }
          return () => <div>Error loading component</div>
        })
    }

    const LazyComponent = React.lazy(loadComponent)
    
    if (config.preload) {
      // Preload the component
      loadComponent()
    }
    
    return (props: T) => (
      <React.Suspense fallback={config.loadingComponent ? <config.loadingComponent /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }

  // Debounce utility for performance optimization
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      
      timeout = setTimeout(() => {
        func(...args)
      }, wait)
    }
  }

  // Throttle utility for performance optimization
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }

  // RequestAnimationFrame utility for smooth animations
  raf(callback: () => void): () => void {
    let requestId: number
    
    const animate = () => {
      callback()
      requestId = requestAnimationFrame(animate)
    }
    
    requestId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(requestId)
    }
  }

  // Intersection Observer for lazy loading images/components
  createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    })
  }

  // Memory optimization
  optimizeMemory(): void {
    // Clear old cache entries
    const now = new Date()
    for (const [key, entry] of this.cache) {
      const age = now.getTime() - entry.timestamp.getTime()
      if (age > entry.ttl * 2) { // Clear entries older than 2x TTL
        this.cache.delete(key)
      }
    }
    
    // Clear old metrics
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-25)
    }
    
    // Trigger garbage collection if available
    if ('gc' in window) {
      (window as any).gc()
    }
  }

  // Performance report
  generateReport(): string {
    const avgMetrics = this.getAverageMetrics()
    const cacheStats = this.getCacheStats()
    
    return `
Performance Report
==================

Average Metrics:
- Component Load Time: ${avgMetrics.componentLoadTime?.toFixed(2) || 0}ms
- API Response Time: ${avgMetrics.apiResponseTime?.toFixed(2) || 0}ms
- Memory Usage: ${avgMetrics.memoryUsage?.toFixed(2) || 0}MB
- Cache Hit Rate: ${((avgMetrics.cacheHitRate || 0) * 100).toFixed(1)}%

Cache Statistics:
- Total Entries: ${cacheStats.size}
- Total Hits: ${cacheStats.entries.reduce((sum, entry) => sum + entry.hits, 0)}

Recommendations:
${this.generateRecommendations()}
    `.trim()
  }

  private generateRecommendations(): string {
    const avgMetrics = this.getAverageMetrics()
    const recommendations: string[] = []
    
    if (avgMetrics.componentLoadTime && avgMetrics.componentLoadTime > 100) {
      recommendations.push('- Consider implementing code splitting for faster component loading')
    }
    
    if (avgMetrics.apiResponseTime && avgMetrics.apiResponseTime > 500) {
      recommendations.push('- API responses are slow, consider caching or optimizing backend calls')
    }
    
    if (avgMetrics.memoryUsage && avgMetrics.memoryUsage > 50) {
      recommendations.push('- High memory usage detected, consider implementing memory optimization')
    }
    
    if (avgMetrics.cacheHitRate && avgMetrics.cacheHitRate < 0.5) {
      recommendations.push('- Low cache hit rate, consider adjusting cache strategy')
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '- Performance is optimal'
  }
}

export const performanceService = new PerformanceService()
export default PerformanceService
