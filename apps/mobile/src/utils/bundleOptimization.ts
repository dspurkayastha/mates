/**
 * Bundle Optimization and Code Splitting Utilities
 * Simplified version to fix compilation issues
 */

import React, { ComponentType, LazyExoticComponent, lazy, Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

interface LazyComponentProps {
  fallback?: React.ReactNode;
  timeout?: number;
  retryCount?: number;
  onError?: (error: Error) => void;
  onLoad?: (loadTime: number) => void;
}

interface ChunkLoadMetrics {
  chunkName: string;
  loadTime: number;
  success: boolean;
  timestamp: Date;
}

interface BundleMetrics {
  totalChunks: number;
  loadedChunks: string[];
  failedChunks: string[];
  averageLoadTime: number;
  cacheHitRate: number;
}

// ============================================================================
// LAZY LOADING CLASS
// ============================================================================

export class LazyComponentLoader {
  private static loadMetrics: ChunkLoadMetrics[] = [];
  private static chunkCache = new Map<string, any>();
  private static retryAttempts = new Map<string, number>();

  static createLazyComponent<T extends ComponentType<any>>(
    importFunction: () => Promise<{ default: T }>,
    chunkName: string,
    options: LazyComponentProps = {}
  ): LazyExoticComponent<T> {
    const { timeout = 10000, retryCount = 3, onError, onLoad } = options;

    const DefaultFallback: React.FC = () => React.createElement(
      View,
      {
        style: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 100,
        },
      },
      React.createElement(ActivityIndicator, { size: 'large' })
    );

    const lazyComponent = lazy(async () => {
      const startTime = Date.now();
      
      try {
        const module = await importFunction();
        const loadTime = Date.now() - startTime;
        
        this.recordLoadMetric({
          chunkName,
          loadTime,
          success: true,
          timestamp: new Date(),
        });

        onLoad?.(loadTime);
        return module;
      } catch (error) {
        const loadTime = Date.now() - startTime;
        
        this.recordLoadMetric({
          chunkName,
          loadTime,
          success: false,
          timestamp: new Date(),
        });

        onError?.(error as Error);
        throw error;
      }
    });

    const WrappedComponent: any = React.forwardRef((props: any, ref: any) => {
      return React.createElement(
        Suspense,
        { fallback: options.fallback || React.createElement(DefaultFallback) },
        React.createElement(lazyComponent as any, { ...props, ref })
      );
    });

    return WrappedComponent;
  }

  private static recordLoadMetric(metric: ChunkLoadMetrics): void {
    this.loadMetrics.push(metric);
    
    if (this.loadMetrics.length > 100) {
      this.loadMetrics = this.loadMetrics.slice(-100);
    }
  }

  static getBundleMetrics(): BundleMetrics {
    const totalChunks = this.loadMetrics.length;
    const loadedChunks = this.loadMetrics
      .filter(m => m.success)
      .map(m => m.chunkName);
    const failedChunks = this.loadMetrics
      .filter(m => !m.success)
      .map(m => m.chunkName);
    
    const successfulLoads = this.loadMetrics.filter(m => m.success);
    const averageLoadTime = successfulLoads.length > 0
      ? successfulLoads.reduce((sum, m) => sum + m.loadTime, 0) / successfulLoads.length
      : 0;

    const cacheHitRate = this.chunkCache.size / Math.max(totalChunks, 1);

    return {
      totalChunks,
      loadedChunks: [...new Set(loadedChunks)],
      failedChunks: [...new Set(failedChunks)],
      averageLoadTime,
      cacheHitRate,
    };
  }

  static clearCache(): void {
    this.chunkCache.clear();
    this.loadMetrics = [];
    this.retryAttempts.clear();
  }
}

// ============================================================================
// OPTIMIZED IMPORTS
// ============================================================================

export const optimizedImport = {
  async importSpecific<T>(modulePath: string, exports: string[]): Promise<Partial<T>> {
    try {
      const module = await import(modulePath);
      const result: Partial<T> = {};
      
      exports.forEach(exportName => {
        if (module[exportName]) {
          (result as any)[exportName] = module[exportName];
        }
      });
      
      return result;
    } catch (error) {
      console.error(`Failed to import specific exports from ${modulePath}:`, error);
      throw error;
    }
  },

  async importConditional<T>(
    modulePath: string,
    condition: boolean | (() => boolean)
  ): Promise<T | null> {
    const shouldImport = typeof condition === 'function' ? condition() : condition;
    
    if (!shouldImport) {
      return null;
    }

    try {
      const module = await import(modulePath);
      return module.default || module;
    } catch (error) {
      console.error(`Failed to conditionally import ${modulePath}:`, error);
      return null;
    }
  },
};

// ============================================================================
// BUNDLE ANALYZER
// ============================================================================

export class BundleAnalyzer {
  private static STORAGE_KEY = '@mates_bundle_metrics';

  static async analyzeBundleUsage(): Promise<BundleMetrics> {
    const metrics = LazyComponentLoader.getBundleMetrics();
    
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        ...metrics,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.warn('Failed to store bundle metrics:', error);
    }

    return metrics;
  }

  static async getHistoricalMetrics(): Promise<BundleMetrics | null> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load historical bundle metrics:', error);
      return null;
    }
  }

  static generateOptimizationRecommendations(metrics: BundleMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.averageLoadTime > 3000) {
      recommendations.push(
        'Consider implementing more aggressive code splitting for chunks taking >3s to load'
      );
    }

    if (metrics.cacheHitRate < 0.8) {
      recommendations.push(
        'Improve caching strategy to increase cache hit rate above 80%'
      );
    }

    if (metrics.failedChunks.length > 0) {
      recommendations.push(
        `Address ${metrics.failedChunks.length} failing chunks: ${metrics.failedChunks.join(', ')}`
      );
    }

    if (metrics.totalChunks > 20) {
      recommendations.push(
        'Consider consolidating smaller chunks to reduce network overhead'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Bundle optimization is performing well!');
    }

    return recommendations;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const createLazyComponent = LazyComponentLoader.createLazyComponent.bind(LazyComponentLoader);
export const getBundleMetrics = LazyComponentLoader.getBundleMetrics.bind(LazyComponentLoader);
export const clearBundleCache = LazyComponentLoader.clearCache.bind(LazyComponentLoader);
export const bundleAnalyzer = BundleAnalyzer;

export const createOptimizedScreen = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  screenName: string,
  options?: LazyComponentProps
) => {
  return createLazyComponent(importFunction, `Screen_${screenName}`, {
    timeout: 15000,
    retryCount: 2,
    ...options,
  });
};

export const createOptimizedComponent = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  componentName: string,
  options?: LazyComponentProps
) => {
  return createLazyComponent(importFunction, `Component_${componentName}`, {
    timeout: 8000,
    retryCount: 3,
    ...options,
  });
};

export default {
  createLazyComponent,
  createOptimizedScreen,
  createOptimizedComponent,
  bundleAnalyzer,
  optimizedImport,
  getBundleMetrics,
  clearBundleCache,
};