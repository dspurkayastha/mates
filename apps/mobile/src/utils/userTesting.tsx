/**
 * User Testing and Feedback Collection System
 * Comprehensive UX research and feedback tools for continuous improvement
 * 2025 standards with A/B testing, heatmaps, and user journey analytics
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Modal,
  Dimensions,
  PanResponder,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../design-system/ThemeProvider';
import { generateAccessibilityLabel } from './accessibility';
import Text from '../components/ui/Text';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { ModernBottomSheet } from '../components/ui/BottomSheet';

// ============================================================================
// TYPES
// ============================================================================

interface UserAction {
  id: string;
  type: 'tap' | 'swipe' | 'long_press' | 'scroll' | 'navigation';
  timestamp: Date;
  coordinates?: { x: number; y: number };
  screenName: string;
  elementId?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface FeedbackData {
  id: string;
  userId: string;
  type: 'rating' | 'comment' | 'bug_report' | 'feature_request' | 'usability';
  content: string;
  rating?: number;
  category: string;
  screenName: string;
  timestamp: Date;
  resolved?: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  attachments?: string[];
}

interface UserTestSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  testType: 'usability' | 'a_b_test' | 'user_journey' | 'accessibility';
  variant?: string; // for A/B testing
  completed: boolean;
  actions: UserAction[];
  feedback: FeedbackData[];
  metrics: {
    sessionDuration: number;
    screenViews: number;
    errors: number;
    taskCompletionRate: number;
    satisfactionScore?: number;
  };
}

interface Heatmap {
  screenName: string;
  touchPoints: Array<{
    x: number;
    y: number;
    intensity: number;
    timestamp: Date;
  }>;
  scrollMap: Array<{
    scrollY: number;
    duration: number;
    timestamp: Date;
  }>;
}

interface UserJourney {
  userId: string;
  sessionId: string;
  path: Array<{
    screenName: string;
    timestamp: Date;
    timeSpent: number;
    exitMethod?: 'navigation' | 'back' | 'close' | 'error';
  }>;
  conversionEvents: Array<{
    event: string;
    timestamp: Date;
    success: boolean;
  }>;
}

// ============================================================================
// USER TESTING MANAGER
// ============================================================================

class UserTestingManager {
  private static instance: UserTestingManager;
  private currentSession: UserTestSession | null = null;
  private actionBuffer: UserAction[] = [];
  private heatmapData: Map<string, Heatmap> = new Map();
  private userJourney: UserJourney | null = null;
  private isTracking = false;

  private readonly STORAGE_KEYS = {
    SESSIONS: '@user_testing_sessions',
    FEEDBACK: '@user_feedback',
    HEATMAPS: '@heatmap_data',
    JOURNEYS: '@user_journeys',
    SETTINGS: '@testing_settings',
  };

  private constructor() {
    this.initializeTracking();
  }

  static getInstance(): UserTestingManager {
    if (!UserTestingManager.instance) {
      UserTestingManager.instance = new UserTestingManager();
    }
    return UserTestingManager.instance;
  }

  // ========================================================================
  // SESSION MANAGEMENT
  // ========================================================================

  async startTestSession(
    userId: string,
    testType: UserTestSession['testType'],
    variant?: string
  ): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.currentSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      testType,
      variant,
      completed: false,
      actions: [],
      feedback: [],
      metrics: {
        sessionDuration: 0,
        screenViews: 0,
        errors: 0,
        taskCompletionRate: 0,
      },
    };

    // Initialize user journey tracking
    this.userJourney = {
      userId,
      sessionId,
      path: [],
      conversionEvents: [],
    };

    this.isTracking = true;
    
    // Record session start event
    console.log('User test session started:', {
      testType,
      variant,
      userId,
    });

    return sessionId;
  }

  async endTestSession(): Promise<UserTestSession | null> {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date();
    this.currentSession.completed = true;
    this.currentSession.metrics.sessionDuration = 
      this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();

    // Flush any remaining actions
    this.currentSession.actions = [...this.currentSession.actions, ...this.actionBuffer];
    this.actionBuffer = [];

    // Save session data
    await this.saveSession(this.currentSession);
    
    // Save heatmap data
    await this.saveHeatmaps();
    
    // Save user journey
    if (this.userJourney) {
      await this.saveUserJourney(this.userJourney);
    }

    const completedSession = { ...this.currentSession };
    this.currentSession = null;
    this.userJourney = null;
    this.isTracking = false;

    return completedSession;
  }

  // ========================================================================
  // ACTION TRACKING
  // ========================================================================

  trackUserAction(
    type: UserAction['type'],
    screenName: string,
    coordinates?: { x: number; y: number },
    elementId?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isTracking) return;

    const action: UserAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      screenName,
      coordinates,
      elementId,
      metadata,
    };

    this.actionBuffer.push(action);

    // Update heatmap data for touch actions
    if (coordinates && (type === 'tap' || type === 'long_press')) {
      this.updateHeatmap(screenName, coordinates);
    }

    // Update user journey
    if (type === 'navigation' && this.userJourney) {
      this.updateUserJourney(screenName);
    }

    // Flush buffer periodically
    if (this.actionBuffer.length >= 10) {
      this.flushActionBuffer();
    }
  }

  trackScreenView(screenName: string, timeSpent?: number): void {
    if (!this.currentSession) return;

    this.trackUserAction('navigation', screenName, undefined, undefined, {
      timeSpent,
      viewType: 'screen_view',
    });

    this.currentSession.metrics.screenViews++;
  }

  async recordError(error: Error, category: string, screenName: string): Promise<void> {
    const errorAction: UserAction = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'navigation',
      timestamp: new Date(),
      screenName,
      elementId: 'error_boundary',
      metadata: {
        error: error.message,
        stack: error.stack,
        category,
      },
    };

    this.actionBuffer.push(errorAction);
    
    if (this.currentSession) {
      this.currentSession.metrics.errors += 1;
    }

    // Log error metric
    console.log('User testing error:', {
      error: error.message,
      category,
      screenName,
    });

    await this.flushActionsIfNeeded();
  }

  // ========================================================================
  // FEEDBACK COLLECTION
  // ========================================================================

  async collectFeedback(feedback: Omit<FeedbackData, 'id' | 'timestamp'>): Promise<string> {
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const feedbackData: FeedbackData = {
      ...feedback,
      id: feedbackId,
      timestamp: new Date(),
    };

    // Add to current session if active
    if (this.currentSession) {
      this.currentSession.feedback.push(feedbackData);
    }

    // Store feedback
    const existingFeedback = await this.loadFeedback();
    await AsyncStorage.setItem(
      this.STORAGE_KEYS.FEEDBACK,
      JSON.stringify([...existingFeedback, feedbackData])
    );

    // Log feedback metric
    console.log('User feedback collected:', {
      type: feedback.type,
      category: feedback.category,
      priority: feedback.priority,
    });

    return feedbackId;
  }

  // ========================================================================
  // A/B TESTING
  // ========================================================================

  getABTestVariant(testName: string): string {
    // Simple A/B test implementation
    const variants = ['A', 'B'];
    const hash = this.hashCode(testName + (this.currentSession?.userId || 'anonymous'));
    return variants[Math.abs(hash) % variants.length];
  }

  recordConversionEvent(event: string, variant: string, success: boolean): void {
    if (!this.userJourney) return;

    this.userJourney.conversionEvents.push({
      event,
      timestamp: new Date(),
      success,
    });

    // Log conversion metric
    console.log('A/B test conversion:', {
      success,
      variant,
      event,
    });
  }

  // ========================================================================
  // HEATMAP GENERATION
  // ========================================================================

  private updateHeatmap(screenName: string, coordinates: { x: number; y: number }): void {
    let heatmap = this.heatmapData.get(screenName);
    
    if (!heatmap) {
      heatmap = {
        screenName,
        touchPoints: [],
        scrollMap: [],
      };
      this.heatmapData.set(screenName, heatmap);
    }

    heatmap.touchPoints.push({
      x: coordinates.x,
      y: coordinates.y,
      intensity: 1,
      timestamp: new Date(),
    });
  }

  async getHeatmapData(screenName: string): Promise<Heatmap | null> {
    try {
      const stored = await AsyncStorage.getItem(`${this.STORAGE_KEYS.HEATMAPS}_${screenName}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
      return null;
    }
  }

  // ========================================================================
  // USER JOURNEY ANALYTICS
  // ========================================================================

  private updateUserJourney(screenName: string): void {
    if (!this.userJourney) return;

    const now = new Date();
    const lastPath = this.userJourney.path[this.userJourney.path.length - 1];
    
    // Update time spent on previous screen
    if (lastPath) {
      lastPath.timeSpent = now.getTime() - lastPath.timestamp.getTime();
    }

    // Add new path entry
    this.userJourney.path.push({
      screenName,
      timestamp: now,
      timeSpent: 0,
    });
  }

  async getUserJourneyAnalytics(userId: string): Promise<UserJourney[]> {
    try {
      const stored = await AsyncStorage.getItem(`${this.STORAGE_KEYS.JOURNEYS}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load user journey analytics:', error);
      return [];
    }
  }

  // ========================================================================
  // DATA PERSISTENCE
  // ========================================================================

  private async saveSession(session: UserTestSession): Promise<void> {
    try {
      const existing = await this.getSessions();
      existing.push(session);
      await AsyncStorage.setItem(this.STORAGE_KEYS.SESSIONS, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save test session:', error);
    }
  }

  private async loadFeedback(): Promise<FeedbackData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.FEEDBACK);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load feedback:', error);
      return [];
    }
  }

  private async saveHeatmaps(): Promise<void> {
    try {
      for (const [screenName, heatmap] of this.heatmapData.entries()) {
        await AsyncStorage.setItem(
          `${this.STORAGE_KEYS.HEATMAPS}_${screenName}`,
          JSON.stringify(heatmap)
        );
      }
    } catch (error) {
      console.error('Failed to save heatmaps:', error);
    }
  }

  private async saveUserJourney(journey: UserJourney): Promise<void> {
    try {
      const existing = await this.getUserJourneyAnalytics(journey.userId);
      existing.push(journey);
      await AsyncStorage.setItem(
        `${this.STORAGE_KEYS.JOURNEYS}_${journey.userId}`,
        JSON.stringify(existing)
      );
    } catch (error) {
      console.error('Failed to save user journey:', error);
    }
  }

  // ========================================================================
  // DATA RETRIEVAL
  // ========================================================================

  async getSessions(): Promise<UserTestSession[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.SESSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  async getFeedback(): Promise<FeedbackData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEYS.FEEDBACK);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load feedback:', error);
      return [];
    }
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private initializeTracking(): void {
    // Set up global error handler for UX testing
    if (typeof ErrorUtils !== 'undefined') {
      const originalHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        this.recordError(new Error(error.message), 'global', 'unknown');
        originalHandler(error, isFatal);
      });
    }
  }

  private flushActionBuffer(): void {
    if (this.currentSession && this.actionBuffer.length > 0) {
      this.currentSession.actions.push(...this.actionBuffer);
      this.actionBuffer = [];
    }
  }

  private async flushActionsIfNeeded(): Promise<void> {
    if (this.actionBuffer.length > 0) {
      await this.flushActionBuffer();
    }
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // ========================================================================
  // ANALYTICS AND REPORTING
  // ========================================================================

  async generateUsabilityReport(): Promise<any> {
    const sessions = await this.getSessions();
    const feedback = await this.getFeedback();

    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = sessions.length;
    const averageSessionDuration = completedSessions.reduce(
      (sum, s) => sum + s.metrics.sessionDuration, 0
    ) / completedSessions.length;
    
    const errorRate = completedSessions.reduce(
      (sum, s) => sum + s.metrics.errors, 0
    ) / completedSessions.reduce(
      (sum, s) => sum + s.metrics.screenViews, 1
    );

    const feedbackByType = feedback.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageRating = feedback
      .filter(f => f.rating !== undefined)
      .reduce((sum, f, _, arr) => sum + (f.rating! / arr.length), 0);

    return {
      totalSessions,
      completedSessions: completedSessions.length,
      completionRate: completedSessions.length / totalSessions,
      averageSessionDuration: averageSessionDuration / 1000, // Convert to seconds
      errorRate,
      feedbackSummary: feedbackByType,
      averageRating,
      topIssues: this.getTopIssues(feedback),
      conversionFunnels: this.analyzeConversionFunnels(sessions),
    };
  }

  private getTopIssues(feedback: FeedbackData[]): Array<{ issue: string; count: number }> {
    const issues = feedback
      .filter(f => f.type === 'bug_report' || f.type === 'usability')
      .reduce((acc, f) => {
        const key = f.category || 'general';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(issues)
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private analyzeConversionFunnels(sessions: UserTestSession[]): any {
    // Analyze conversion funnels from user journeys
    const funnelSteps = ['onboarding', 'expense_add', 'expense_view', 'settings'];
    const conversions = sessions.map(session => {
      const screenViews = session.actions
        .filter(a => a.type === 'navigation')
        .map(a => a.screenName);
      
      const stepCompletion = funnelSteps.map(step => 
        screenViews.some(screen => screen.toLowerCase().includes(step))
      );
      
      return stepCompletion;
    });

    return funnelSteps.map((step, index) => ({
      step,
      completions: conversions.filter(c => c[index]).length,
      rate: conversions.filter(c => c[index]).length / conversions.length,
    }));
  }
}

// ============================================================================
// FEEDBACK WIDGETS
// ============================================================================

interface FeedbackWidgetProps {
  screenName: string;
  onFeedbackSubmitted?: (feedback: FeedbackData) => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  screenName,
  onFeedbackSubmitted,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackData['type']>('rating');
  const bottomSheetRef = useRef<any>(null);

  const handleSubmit = async () => {
    const feedback = await userTestingManager.collectFeedback({
      userId: 'current_user', // In real app, get from auth
      type: feedbackType,
      content: comment,
      rating: feedbackType === 'rating' ? rating : undefined,
      category: 'ui_feedback',
      screenName,
      priority: rating <= 2 ? 'high' : rating <= 3 ? 'medium' : 'low',
    });

    onFeedbackSubmitted?.(await userTestingManager.getFeedback().then(f => 
      f.find(fb => fb.id === feedback)!
    ));

    bottomSheetRef.current?.close();
    setRating(0);
    setComment('');
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          variant="primary"
          size="small"
          onPress={() => bottomSheetRef.current?.expand()}
          style={{
            borderRadius: 25,
            paddingHorizontal: tokens.Spacing.lg,
          }}
          leftIcon={<Icon name="MessageCircle" size="sm" color="inverse" />}
          accessibilityLabel="Provide feedback"
        >
          Feedback
        </Button>
      </Animated.View>

      {/* Feedback Modal */}
      <ModernBottomSheet
        ref={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        title="Share Your Feedback"
        snapPoints={['50%', '80%']}
      >
        <View style={{ padding: tokens.Spacing.lg }}>
          {/* Feedback Type Selector */}
          <Text
            variant="titleMedium"
            color="primary"
            weight="semibold"
            style={{ marginBottom: tokens.Spacing.md }}
          >
            What type of feedback do you have?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: tokens.Spacing.sm,
              marginBottom: tokens.Spacing.lg,
            }}
          >
            {(['rating', 'comment', 'bug_report', 'feature_request'] as const).map((type) => (
              <Button
                key={type}
                variant={feedbackType === type ? 'primary' : 'secondary'}
                size="small"
                onPress={() => setFeedbackType(type)}
              >
                {type.replace('_', ' ').toUpperCase()}
              </Button>
            ))}
          </View>

          {/* Rating Section */}
          {feedbackType === 'rating' && (
            <View style={{ marginBottom: tokens.Spacing.lg }}>
              <Text
                variant="bodyMedium"
                color="primary"
                style={{ marginBottom: tokens.Spacing.md }}
              >
                How would you rate your experience?
              </Text>
              
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: tokens.Spacing.md,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="tertiary"
                    size="medium"
                    onPress={() => setRating(star)}
                    style={{
                      backgroundColor: rating >= star 
                        ? colors.status.warning 
                        : colors.background.secondary,
                    }}
                    accessibilityLabel={`Rate ${star} stars`}
                  >
                    <Icon
                      name="Star"
                      size="lg"
                      color={rating >= star ? 'inverse' : 'secondary'}
                    />
                  </Button>
                ))}
              </View>
            </View>
          )}

          {/* Comment Section */}
          <View style={{ marginBottom: tokens.Spacing.lg }}>
            <Text
              variant="bodyMedium"
              color="primary"
              style={{ marginBottom: tokens.Spacing.sm }}
            >
              Additional comments (optional):
            </Text>
            
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.border.medium,
                borderRadius: tokens.BorderRadius.lg,
                padding: tokens.Spacing.md,
                minHeight: 100,
                backgroundColor: colors.background.secondary,
              }}
            >
              {/* In real app, use TextInput */}
              <Text variant="bodyMedium" color="tertiary">
                Your feedback helps us improve...
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleSubmit}
            disabled={feedbackType === 'rating' ? rating === 0 : false}
            gradient
            accessibilityLabel="Submit feedback"
          >
            Submit Feedback
          </Button>
        </View>
      </ModernBottomSheet>
    </>
  );
};

// ============================================================================
// EXPORTED UTILITIES
// ============================================================================

export const userTestingManager = UserTestingManager.getInstance();

// Higher-order component for tracking screen views
export const withUserTracking = <P extends object>(
  Component: React.ComponentType<P>,
  screenName: string
) => {
  return React.forwardRef<any, P>((props, ref) => {
    useEffect(() => {
      const startTime = Date.now();
      
      userTestingManager.trackScreenView(screenName);
      
      return () => {
        const timeSpent = Date.now() - startTime;
        userTestingManager.trackScreenView(screenName, timeSpent);
      };
    }, []);

    return <Component {...(props as any)} ref={ref} />;
  });
};

// Hook for tracking user interactions
export const useUserTracking = (screenName: string) => {
  const trackAction = (
    type: UserAction['type'],
    elementId?: string,
    coordinates?: { x: number; y: number },
    metadata?: Record<string, any>
  ) => {
    userTestingManager.trackUserAction(type, screenName, coordinates, elementId, metadata);
  };

  return { trackAction };
};

export default userTestingManager;