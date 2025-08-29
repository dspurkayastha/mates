/**
 * Performance Monitoring & Analytics
 * Real-time performance tracking, metrics collection, and analytics
 * 2025 performance optimization standards
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Dimensions, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'render' | 'navigation' | 'network' | 'memory' | 'battery' | 'user';
  tags?: Record<string, string>;
}

export interface NavigationMetric {
  from: string;
  to: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

export interface RenderMetric {
  component: string;
  renderTime: number;
  updateCount: number;
  timestamp: number;
}

export interface UserInteractionMetric {
  action: string;
  element: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  period: 'session' | 'daily' | 'weekly';
  metrics: PerformanceMetric[];
  averages: Record<string, number>;
  trends: Record<string, number[]>;
  issues: PerformanceIssue[];
}

interface PerformanceIssue {
  type: 'slow_render' | 'memory_leak' | 'navigation_delay' | 'network_timeout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface PerformanceContextType {
  recordMetric: (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => void;
  recordNavigation: (from: string, to: string, duration: number, success?: boolean) => void;
  recordRender: (component: string, renderTime: number, updateCount?: number) => void;
  recordUserInteraction: (action: string, element: string, duration?: number, metadata?: Record<string, any>) => void;
  getReport: (period: 'session' | 'daily' | 'weekly') => Promise<PerformanceReport>;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

// ============================================================================
// PERFORMANCE CONTEXT
// ============================================================================

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

const STORAGE_KEY = '@mates_performance_metrics';
const SETTINGS_KEY = '@mates_performance_enabled';

// ============================================================================
// PERFORMANCE METRICS COLLECTOR
// ============================================================================

class PerformanceCollector {
  private metrics: PerformanceMetric[] = [];
  private sessionStart: number = Date.now();
  private currentSession: string = this.generateSessionId();
  private enabled: boolean = true;

  constructor() {
    this.startSession();
    this.setupListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startSession() {
    this.recordMetric({
      name: 'session_start',
      value: 1,
      unit: 'count',
      category: 'user',
      tags: {
        platform: Platform.OS,
        version: Platform.Version.toString(),
        session: this.currentSession,
      },
    });
  }

  private setupListeners() {
    // App state changes
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    // Memory warnings (iOS)
    if (Platform.OS === 'ios') {
      // Memory warning listener would be implemented via native module
    }

    // Network state changes
    // Would integrate with @react-native-netinfo for network monitoring
  }

  private handleAppStateChange(nextAppState: AppStateStatus) {
    const now = Date.now();
    const sessionDuration = now - this.sessionStart;

    if (nextAppState === 'background') {
      this.recordMetric({
        name: 'session_background',
        value: sessionDuration,
        unit: 'ms',
        category: 'user',
        tags: { session: this.currentSession },
      });
    } else if (nextAppState === 'active') {
      this.recordMetric({
        name: 'session_foreground',
        value: sessionDuration,
        unit: 'ms',
        category: 'user',
        tags: { session: this.currentSession },
      });
    }
  }

  recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) {
    if (!this.enabled) return;

    const fullMetric: PerformanceMetric = {
      ...metric,
      id: this.generateMetricId(),
      timestamp: Date.now(),
    };

    this.metrics.push(fullMetric);
    this.persistMetrics();

    // Auto-cleanup old metrics (keep last 1000)
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check for performance issues
    this.checkForIssues(fullMetric);
  }

  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async persistMetrics() {
    try {
      const recentMetrics = this.metrics.slice(-100); // Store only recent metrics
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentMetrics));
    } catch (error) {
      console.warn('Failed to persist performance metrics:', error);
    }
  }

  private checkForIssues(metric: PerformanceMetric) {
    const issues: PerformanceIssue[] = [];

    // Check for slow renders
    if (metric.category === 'render' && metric.value > 16) { // 16ms = 60fps threshold
      issues.push({
        type: 'slow_render',
        severity: metric.value > 100 ? 'high' : 'medium',
        description: `Slow render detected: ${metric.value}ms for ${metric.name}`,
        timestamp: metric.timestamp,
        metadata: { metric },
      });
    }

    // Check for slow navigation
    if (metric.category === 'navigation' && metric.value > 1000) { // 1s threshold
      issues.push({
        type: 'navigation_delay',
        severity: metric.value > 3000 ? 'high' : 'medium',
        description: `Slow navigation detected: ${metric.value}ms`,
        timestamp: metric.timestamp,
        metadata: { metric },
      });
    }

    // Log issues for debugging
    if (issues.length > 0 && __DEV__) {
      console.warn('Performance issues detected:', issues);
    }
  }

  async getReport(period: 'session' | 'daily' | 'weekly'): Promise<PerformanceReport> {
    const now = Date.now();
    let startTime = this.sessionStart;

    switch (period) {
      case 'daily':
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
    }

    const periodMetrics = this.metrics.filter(m => m.timestamp >= startTime);
    const averages = this.calculateAverages(periodMetrics);
    const trends = this.calculateTrends(periodMetrics);
    const issues = this.detectIssues(periodMetrics);

    return {
      period,
      metrics: periodMetrics,
      averages,
      trends,
      issues,
    };
  }

  private calculateAverages(metrics: PerformanceMetric[]): Record<string, number> {
    const groups = this.groupBy(metrics, 'name');
    const averages: Record<string, number> = {};

    Object.entries(groups).forEach(([name, groupMetrics]) => {
      const sum = groupMetrics.reduce((acc, m) => acc + m.value, 0);
      averages[name] = sum / groupMetrics.length;
    });

    return averages;
  }

  private calculateTrends(metrics: PerformanceMetric[]): Record<string, number[]> {
    const groups = this.groupBy(metrics, 'name');
    const trends: Record<string, number[]> = {};

    Object.entries(groups).forEach(([name, groupMetrics]) => {
      trends[name] = groupMetrics
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(m => m.value);
    });

    return trends;
  }

  private detectIssues(metrics: PerformanceMetric[]): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];

    // Group metrics by category for analysis
    const categories = this.groupBy(metrics, 'category');

    // Analyze render performance
    if (categories.render) {
      const slowRenders = categories.render.filter(m => m.value > 16);
      if (slowRenders.length > categories.render.length * 0.1) { // 10% threshold
        issues.push({
          type: 'slow_render',
          severity: 'medium',
          description: `${slowRenders.length} slow renders detected`,
          timestamp: Date.now(),
          metadata: { count: slowRenders.length, total: categories.render.length },
        });
      }
    }

    // Analyze navigation performance
    if (categories.navigation) {
      const slowNavigation = categories.navigation.filter(m => m.value > 1000);
      if (slowNavigation.length > 0) {
        issues.push({
          type: 'navigation_delay',
          severity: 'medium',
          description: `${slowNavigation.length} slow navigations detected`,
          timestamp: Date.now(),
          metadata: { count: slowNavigation.length },
        });
      }
    }

    return issues;
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(enabled));
  }

  async loadSettings() {
    try {
      const enabledStr = await AsyncStorage.getItem(SETTINGS_KEY);
      if (enabledStr) {
        this.enabled = JSON.parse(enabledStr);
      }
    } catch (error) {
      console.warn('Failed to load performance settings:', error);
    }
  }
}

// ============================================================================
// PERFORMANCE PROVIDER
// ============================================================================

interface PerformanceProviderProps {
  children: React.ReactNode;
  autoStart?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  autoStart = true,
}) => {
  const [collector] = useState(() => new PerformanceCollector());
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (autoStart) {
      collector.loadSettings();
    }
  }, [autoStart, collector]);

  const recordMetric = (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) => {
    collector.recordMetric(metric);
  };

  const recordNavigation = (from: string, to: string, duration: number, success = true) => {
    collector.recordMetric({
      name: 'navigation',
      value: duration,
      unit: 'ms',
      category: 'navigation',
      tags: { from, to, success: success.toString() },
    });
  };

  const recordRender = (component: string, renderTime: number, updateCount = 1) => {
    collector.recordMetric({
      name: 'render',
      value: renderTime,
      unit: 'ms',
      category: 'render',
      tags: { component, updates: updateCount.toString() },
    });
  };

  const recordUserInteraction = (
    action: string,
    element: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    collector.recordMetric({
      name: 'user_interaction',
      value: duration || 1,
      unit: duration ? 'ms' : 'count',
      category: 'user',
      tags: {
        action,
        element,
        ...metadata,
      },
    });
  };

  const getReport = (period: 'session' | 'daily' | 'weekly') => {
    return collector.getReport(period);
  };

  const setEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    collector.setEnabled(enabled);
  };

  const contextValue: PerformanceContextType = {
    recordMetric,
    recordNavigation,
    recordRender,
    recordUserInteraction,
    getReport,
    isEnabled,
    setEnabled,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// ============================================================================
// PERFORMANCE HOOKS FOR COMPONENTS
// ============================================================================

export const useRenderPerformance = (componentName: string) => {
  const { recordRender } = usePerformance();
  const renderCount = React.useRef(0);
  const startTime = React.useRef(Date.now());

  React.useLayoutEffect(() => {
    renderCount.current += 1;
  });

  React.useEffect(() => {
    const renderTime = Date.now() - startTime.current;
    recordRender(componentName, renderTime, renderCount.current);
    startTime.current = Date.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

export const useNavigationPerformance = () => {
  const { recordNavigation } = usePerformance();
  const navigationStart = React.useRef<{ from: string; startTime: number } | null>(null);

  const startNavigation = (from: string) => {
    navigationStart.current = { from, startTime: Date.now() };
  };

  const endNavigation = (to: string, success = true) => {
    if (navigationStart.current) {
      const duration = Date.now() - navigationStart.current.startTime;
      recordNavigation(navigationStart.current.from, to, duration, success);
      navigationStart.current = null;
    }
  };

  return { startNavigation, endNavigation };
};

export const useInteractionPerformance = () => {
  const { recordUserInteraction } = usePerformance();

  const recordInteraction = (action: string, element: string, metadata?: Record<string, any>) => {
    recordUserInteraction(action, element, undefined, metadata);
  };

  const recordTimedInteraction = (action: string, element: string) => {
    const startTime = Date.now();
    
    return (metadata?: Record<string, any>) => {
      const duration = Date.now() - startTime;
      recordUserInteraction(action, element, duration, metadata);
    };
  };

  return { recordInteraction, recordTimedInteraction };
};

// ============================================================================
// DEVICE INFO UTILITIES
// ============================================================================

export const getDeviceInfo = () => {
  const { width, height } = Dimensions.get('window');
  
  return {
    platform: Platform.OS,
    version: Platform.Version,
    screenWidth: width,
    screenHeight: height,
    isTablet: width > 768,
    isWeb: Platform.OS === 'web',
    timestamp: Date.now(),
  };
};

export const getMemoryInfo = async () => {
  // This would typically require a native module
  // For now, return mock data
  return {
    used: 0,
    available: 0,
    total: 0,
    timestamp: Date.now(),
  };
};

export default {
  PerformanceProvider,
  usePerformance,
  useRenderPerformance,
  useNavigationPerformance,
  useInteractionPerformance,
  getDeviceInfo,
  getMemoryInfo,
};