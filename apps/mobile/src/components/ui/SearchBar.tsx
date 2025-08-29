/**
 * Advanced Search Component
 * Real-time filtering, highlighting, and modern search patterns
 * 2025 design standards with accessibility and performance optimization
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TextInput,
  ViewStyle,
  TextInputProps,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import { generateAccessibilityLabel, generateAccessibilityHint } from '../../utils/accessibility';
import Text from './Text';
import Icon from './Icon';
import Card from './Card';
import LoadingSkeleton from './LoadingSkeleton';

// Helper function for category icons
const getCategoryIcon = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'expense': 'DollarSign',
    'grocery': 'ShoppingCart',
    'chore': 'SquareCheck',
    'user': 'User',
    'house': 'Home',
    'poll': 'MessageSquare',
    'default': 'Search'
  };
  
  return categoryMap[category.toLowerCase()] || categoryMap.default;
};

// ============================================================================
// TYPES
// ============================================================================

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  data?: any;
  relevanceScore?: number;
}

export interface SearchFilter {
  id: string;
  label: string;
  active: boolean;
  count?: number;
}

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  filters?: SearchFilter[];
  onFilterChange?: (filters: SearchFilter[]) => void;
  loading?: boolean;
  placeholder?: string;
  showRecentSearches?: boolean;
  recentSearches?: string[];
  onRecentSearchSelect?: (search: string) => void;
  onClearRecentSearches?: () => void;
  debounceMs?: number;
  maxResults?: number;
  emptyStateMessage?: string;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

// ============================================================================
// HIGHLIGHT TEXT COMPONENT
// ============================================================================

interface HighlightTextProps {
  text: string;
  query: string;
  variant?: 'titleMedium' | 'bodyMedium' | 'bodySmall';
  color?: string;
  highlightColor?: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  variant = 'bodyMedium',
  color = 'primary',
  highlightColor,
}) => {
  const colors = useColors();
  const actualHighlightColor = highlightColor || colors.interactive.primary;

  if (!query.trim()) {
    return (
      <Text variant={variant} color={color}>
        {text}
      </Text>
    );
  }

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <Text variant={variant} color={color}>
      {parts.map((part, index) => (
        <Text
          key={index}
          variant={variant}
          color={part.toLowerCase() === query.toLowerCase() ? actualHighlightColor : color}
          weight={part.toLowerCase() === query.toLowerCase() ? 'semibold' : 'normal'}
        >
          {part}
        </Text>
      ))}
    </Text>
  );
};

// ============================================================================
// SEARCH RESULT ITEM
// ============================================================================

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  onSelect: (result: SearchResult) => void;
  index: number;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  query,
  onSelect,
  index,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => onSelect(result)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          paddingHorizontal: tokens.Spacing.lg,
          paddingVertical: tokens.Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        accessibilityRole="button"
        accessibilityLabel={generateAccessibilityLabel.list.item(
          `${result.title}${result.subtitle ? ', ' + result.subtitle : ''}`,
          index + 1,
          1 // We don't know total here, but it's not critical
        )}
      >
        {/* Category Icon */}
        {result.category && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.background.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: tokens.Spacing.md,
            }}
          >
            <Icon
              name={getCategoryIcon(result.category) as any}
              size="sm"
              color="secondary"
            />
          </View>
        )}

        {/* Content */}
        <View style={{ flex: 1 }}>
          <HighlightText
            text={result.title}
            query={query}
            variant="titleMedium"
            color="primary"
          />
          {result.subtitle && (
            <HighlightText
              text={result.subtitle}
              query={query}
              variant="bodySmall"
              color="secondary"
            />
          )}
          {result.category && (
            <Text variant="labelSmall" color="tertiary" style={{ marginTop: 2 }}>
              {result.category}
            </Text>
          )}
        </View>

        {/* Relevance Score (Debug) */}
        {__DEV__ && result.relevanceScore && (
          <Text variant="labelSmall" color="tertiary">
            {Math.round(result.relevanceScore * 100)}%
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================================================
// FILTER CHIPS
// ============================================================================

interface FilterChipsProps {
  filters: SearchFilter[];
  onFilterChange: (filters: SearchFilter[]) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onFilterChange }) => {
  const colors = useColors();
  const tokens = useTokens();

  const toggleFilter = (filterId: string) => {
    const updatedFilters = filters.map(filter => ({
      ...filter,
      active: filter.id === filterId ? !filter.active : filter.active,
    }));
    onFilterChange(updatedFilters);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: tokens.Spacing.lg,
        gap: tokens.Spacing.sm,
      }}
      style={{ marginBottom: tokens.Spacing.md }}
    >
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          onPress={() => toggleFilter(filter.id)}
          style={{
            paddingHorizontal: tokens.Spacing.md,
            paddingVertical: tokens.Spacing.sm,
            borderRadius: tokens.BorderRadius.full,
            backgroundColor: filter.active 
              ? colors.interactive.primary 
              : colors.background.secondary,
            borderWidth: 1,
            borderColor: filter.active 
              ? colors.interactive.primary 
              : colors.border.light,
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.Spacing.xs,
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: filter.active }}
          accessibilityLabel={`Filter by ${filter.label}${filter.count ? `, ${filter.count} items` : ''}`}
        >
          <Text
            variant="labelMedium"
            color={filter.active ? 'inverse' : 'secondary'}
            weight="semibold"
          >
            {filter.label}
          </Text>
          {filter.count !== undefined && (
            <View
              style={{
                backgroundColor: filter.active 
                  ? colors.text.inverse 
                  : colors.background.primary,
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
                minWidth: 20,
                alignItems: 'center',
              }}
            >
              <Text
                variant="labelSmall"
                color={filter.active ? 'primary' : 'secondary'}
                weight="semibold"
              >
                {filter.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ============================================================================
// RECENT SEARCHES
// ============================================================================

interface RecentSearchesProps {
  searches: string[];
  onSelect: (search: string) => void;
  onClear: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelect,
  onClear,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  if (searches.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: tokens.Spacing.lg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: tokens.Spacing.md,
        }}
      >
        <Text variant="labelLarge" color="secondary" weight="semibold">
          Recent Searches
        </Text>
        <TouchableOpacity
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear recent searches"
        >
          <Text variant="labelMedium" color="tertiary">
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      {searches.slice(0, 5).map((search, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(search)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.Spacing.sm,
            gap: tokens.Spacing.md,
          }}
          accessibilityRole="button"
          accessibilityLabel={`Recent search: ${search}`}
        >
          <Icon name="Clock" size="sm" color="tertiary" />
          <Text variant="bodyMedium" color="secondary" style={{ flex: 1 }}>
            {search}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ============================================================================
// MAIN SEARCH BAR COMPONENT
// ============================================================================

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultSelect,
  results = [],
  filters = [],
  onFilterChange,
  loading = false,
  placeholder = "Search...",
  showRecentSearches = false,
  recentSearches = [],
  onRecentSearchSelect,
  onClearRecentSearches,
  debounceMs = 300,
  maxResults = 50,
  emptyStateMessage = "No results found",
  style,
  containerStyle,
  ...textInputProps
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Animations
  const searchBarScale = useSharedValue(1);
  const resultsOpacity = useSharedValue(0);
  const resultsTranslateY = useSharedValue(-10);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(query.trim(), filters);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, filters, debounceMs, onSearch]);

  // Show/hide results
  useEffect(() => {
    const shouldShowResults = focused && (query.trim().length > 0 || showRecentSearches);
    setShowResults(shouldShowResults);
    
    if (shouldShowResults) {
      resultsOpacity.value = withTiming(1, { duration: 200 });
      resultsTranslateY.value = withSpring(0);
    } else {
      resultsOpacity.value = withTiming(0, { duration: 150 });
      resultsTranslateY.value = withTiming(-10, { duration: 150 });
    }
  }, [focused, query, showRecentSearches]);

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchBarScale.value }],
  }));

  const resultsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
    transform: [{ translateY: resultsTranslateY.value }],
  }));

  const handleFocus = () => {
    setFocused(true);
    searchBarScale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    // Delay blur to allow result selection
    setTimeout(() => {
      setFocused(false);
      searchBarScale.value = withSpring(1);
    }, 150);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleResultSelect = (result: SearchResult) => {
    setQuery(result.title);
    setFocused(false);
    Keyboard.dismiss();
    onResultSelect?.(result);
  };

  const handleRecentSearchSelect = (search: string) => {
    setQuery(search);
    onRecentSearchSelect?.(search);
  };

  // Filter and sort results
  const displayResults = useMemo(() => {
    let filteredResults = results;
    
    // Apply filters
    const activeFilters = filters.filter(f => f.active);
    if (activeFilters.length > 0) {
      filteredResults = results.filter(result => 
        activeFilters.some(filter => 
          result.category?.toLowerCase() === filter.id.toLowerCase()
        )
      );
    }
    
    // Sort by relevance score
    filteredResults.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    
    return filteredResults.slice(0, maxResults);
  }, [results, filters, maxResults]);

  return (
    <View style={containerStyle}>
      {/* Search Bar */}
      <Animated.View style={searchBarAnimatedStyle}>
        <Card
          variant="elevated"
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: tokens.Spacing.lg,
              paddingVertical: tokens.Spacing.md,
              margin: tokens.Spacing.md,
              borderWidth: focused ? 2 : 1,
              borderColor: focused ? colors.interactive.primary : colors.border.light,
            },
            style,
          ] as any}
        >
          <Icon name="Search" size="md" color="secondary" />
          
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            style={{
              flex: 1,
              marginLeft: tokens.Spacing.md,
              fontSize: tokens.Typography.body.medium.fontSize,
              color: colors.text.primary,
              fontFamily: 'Inter',
            }}
            accessibilityLabel="Search input"
            accessibilityHint={generateAccessibilityHint.form.textInput}
            {...textInputProps}
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={{ padding: tokens.Spacing.xs }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Icon name="X" size="sm" color="tertiary" />
            </TouchableOpacity>
          )}
        </Card>
      </Animated.View>

      {/* Filters */}
      {filters.length > 0 && showResults && (
        <FilterChips filters={filters} onFilterChange={onFilterChange || (() => {})} />
      )}

      {/* Results */}
      {showResults && (
        <Animated.View style={resultsAnimatedStyle}>
          <Card
            variant="elevated"
            style={{
              marginHorizontal: tokens.Spacing.md,
              maxHeight: 400,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Loading State */}
              {loading && (
                <View style={{ padding: tokens.Spacing.lg }}>
                  <LoadingSkeleton width="100%" height={40} style={{ marginBottom: 8 }} />
                  <LoadingSkeleton width="100%" height={40} style={{ marginBottom: 8 }} />
                  <LoadingSkeleton width="100%" height={40} />
                </View>
              )}

              {/* Recent Searches */}
              {!loading && query.trim().length === 0 && showRecentSearches && (
                <RecentSearches
                  searches={recentSearches}
                  onSelect={handleRecentSearchSelect}
                  onClear={onClearRecentSearches || (() => {})}
                />
              )}

              {/* Search Results */}
              {!loading && query.trim().length > 0 && (
                <>
                  {displayResults.length > 0 ? (
                    displayResults.map((result, index) => (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        query={query}
                        onSelect={handleResultSelect}
                        index={index}
                      />
                    ))
                  ) : (
                    <View
                      style={{
                        padding: tokens.Spacing['2xl'],
                        alignItems: 'center',
                      }}
                    >
                      <Icon name="Search" size="lg" color="tertiary" />
                      <Text
                        variant="bodyMedium"
                        color="secondary"
                        align="center"
                        style={{ marginTop: tokens.Spacing.md }}
                      >
                        {emptyStateMessage}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </Card>
        </Animated.View>
      )}
    </View>
  );
};

export default SearchBar;