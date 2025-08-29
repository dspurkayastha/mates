/**
 * Lazy Loading System
 * Optimized lazy loading for images and components
 * Reduces initial bundle size and improves performance
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  View,
  Image,
  ImageProps,
  ViewStyle,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useColors, useTokens } from '../design-system/ThemeProvider';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import Text from '../components/ui/Text';

// ============================================================================
// INTERSECTION OBSERVER (Web) / VIEWPORT DETECTION
// ============================================================================

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useInView = (options: UseInViewOptions = {}) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<any>(null);
  const elementRef = useRef<View>(null);

  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options;

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || Platform.OS !== 'web') {
      // For native platforms, we'll use a simple viewport check
      setInView(true);
      return;
    }

    // Web platform - use Intersection Observer
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setInView(entry.isIntersecting);
        
        if (entry.isIntersecting && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    // @ts-ignore - Web specific implementation
    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, inView, entry };
};

// ============================================================================
// LAZY IMAGE COMPONENT
// ============================================================================

interface LazyImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  aspectRatio?: number;
  blurhash?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: ViewStyle;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  placeholder,
  fallback,
  aspectRatio,
  blurhash,
  priority = false,
  onLoad,
  onError,
  style,
  ...imageProps
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    triggerOnce: true,
  });

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  // Load image when in view or if priority
  const shouldLoad = priority || inView;

  useEffect(() => {
    if (shouldLoad && typeof source === 'object' && source.uri) {
      // Pre-fetch image to get dimensions
      Image.getSize(
        source.uri,
        (width, height) => {
          setImageSize({ width, height });
        },
        () => {
          // Ignore errors in size fetching
        }
      );
    }
  }, [shouldLoad, source]);

  const handleLoad = () => {
    setLoaded(true);
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 20, stiffness: 150 });
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Calculate container dimensions
  const getContainerStyle = (): ViewStyle => {
    let containerStyle: ViewStyle = {};

    if (aspectRatio) {
      containerStyle.aspectRatio = aspectRatio;
    } else if (imageSize) {
      containerStyle.aspectRatio = imageSize.width / imageSize.height;
    }

    return {
      backgroundColor: colors.background.secondary,
      borderRadius: tokens.BorderRadius.md,
      overflow: 'hidden',
      ...containerStyle,
      ...style,
    };
  };

  return (
    <View ref={ref} style={getContainerStyle()}>
      {!shouldLoad && (
        placeholder || (
          <LoadingSkeleton
            width="100%"
            height="100%"
            style={{ borderRadius: tokens.BorderRadius.md }}
          />
        )
      )}

      {shouldLoad && !error && (
        <>
          {!loaded && (
            placeholder || (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: colors.background.secondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LoadingSkeleton
                  width="100%"
                  height="100%"
                  style={{ borderRadius: tokens.BorderRadius.md }}
                />
              </View>
            )
          )}

          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Image
              source={source}
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
              {...imageProps}
            />
          </Animated.View>
        </>
      )}

      {error && (
        fallback || (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background.secondary,
              padding: tokens.Spacing.md,
            }}
          >
            <Text variant="bodySmall" color="tertiary" align="center">
              Failed to load image
            </Text>
          </View>
        )
      )}
    </View>
  );
};

// ============================================================================
// LAZY COMPONENT WRAPPER
// ============================================================================

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  placeholder?: React.ReactNode;
  delay?: number;
  priority?: boolean;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback,
  placeholder,
  delay = 0,
  priority = false,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [shouldRender, setShouldRender] = useState(priority);

  useEffect(() => {
    if (inView && !shouldRender) {
      if (delay > 0) {
        setTimeout(() => setShouldRender(true), delay);
      } else {
        setShouldRender(true);
      }
    }
  }, [inView, shouldRender, delay]);

  if (!shouldRender) {
    return (
      <View ref={ref}>
        {placeholder || (
          <LoadingSkeleton
            width="100%"
            height={100}
            style={{ marginBottom: 16 }}
          />
        )}
      </View>
    );
  }

  return (
    <Suspense fallback={fallback || <LoadingSkeleton width="100%" height={100} />}>
      <View ref={ref}>
        {children}
      </View>
    </Suspense>
  );
};

// ============================================================================
// LAZY ROUTE/SCREEN LOADER
// ============================================================================

export const createLazyScreen = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return lazy(importFunc);
};

// ============================================================================
// VIRTUAL LIST FOR LARGE DATASETS
// ============================================================================

interface VirtualListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export const VirtualList = <T,>({
  data,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  onEndReached,
  onEndReachedThreshold = 0.8,
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollViewRef = useRef<any>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(data.length - 1, startIndex + visibleCount + overscan * 2);

  const visibleItems = data.slice(startIndex, endIndex + 1);

  const totalHeight = data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (event: any) => {
    const newScrollTop = event.nativeEvent.contentOffset.y;
    setScrollTop(newScrollTop);

    // Check if we need to load more items
    const scrollRatio = (newScrollTop + containerHeight) / totalHeight;
    if (scrollRatio >= onEndReachedThreshold && onEndReached) {
      onEndReached();
    }
  };

  return (
    <View style={{ height: containerHeight }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentContainerStyle={{
          height: totalHeight,
          paddingTop: offsetY,
        }}
      >
        {visibleItems.map((item, index) => (
          <View
            key={startIndex + index}
            style={{
              height: itemHeight,
            }}
          >
            {renderItem(item, startIndex + index)}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

// ============================================================================
// IMAGE PRELOADER
// ============================================================================

export class ImagePreloader {
  private cache = new Map<string, boolean>();
  private loading = new Set<string>();

  async preload(uri: string): Promise<boolean> {
    if (this.cache.has(uri)) {
      return this.cache.get(uri)!;
    }

    if (this.loading.has(uri)) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loading.has(uri)) {
            resolve(this.cache.get(uri) || false);
          } else {
            setTimeout(checkLoading, 50);
          }
        };
        checkLoading();
      });
    }

    this.loading.add(uri);

    try {
      await new Promise<void>((resolve, reject) => {
        const image = new (Image as any)();
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = uri;
      });

      this.cache.set(uri, true);
      this.loading.delete(uri);
      return true;
    } catch (error) {
      this.cache.set(uri, false);
      this.loading.delete(uri);
      return false;
    }
  }

  async preloadBatch(uris: string[], concurrency = 3): Promise<boolean[]> {
    const batches: string[][] = [];
    for (let i = 0; i < uris.length; i += concurrency) {
      batches.push(uris.slice(i, i + concurrency));
    }

    const results: boolean[] = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(uri => this.preload(uri))
      );
      results.push(...batchResults);
    }

    return results;
  }

  isLoaded(uri: string): boolean {
    return this.cache.get(uri) === true;
  }

  clear() {
    this.cache.clear();
    this.loading.clear();
  }
}

// ============================================================================
// HOOKS
// ============================================================================

export const useImagePreloader = () => {
  const preloaderRef = useRef(new ImagePreloader());
  return preloaderRef.current;
};

export const useLazyLoad = (threshold = 0.1) => {
  return useInView({ threshold, triggerOnce: true });
};

// ============================================================================
// BUNDLE SPLITTING UTILITIES
// ============================================================================

export const splitBundle = {
  // Core components (always loaded)
  core: () => import('../components/ui'),
  
  // Feature-specific bundles
  expenses: () => import('../screens/expenses'),
  settings: () => import('../screens/SettingsScreen'),
  onboarding: () => import('../components/ui/Onboarding'),
  
  // Utility bundles
  analytics: () => import('../utils/performance'),
  accessibility: () => import('../utils/accessibility'),
};

export default {
  LazyImage,
  LazyComponent,
  VirtualList,
  ImagePreloader,
  useImagePreloader,
  useLazyLoad,
  useInView,
  createLazyScreen,
  splitBundle,
};