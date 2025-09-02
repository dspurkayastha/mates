import { StyleProp, ViewStyle } from 'react-native';

/**
 * Ensure minimum touch target of 44x44pt without forcing layout changes.
 * Returns a style array combining the provided style with min dimensions.
 */
export const ensureMinTouchTarget = (style?: StyleProp<ViewStyle>): StyleProp<ViewStyle> => [
  { minWidth: 44, minHeight: 44 },
  style,
];

/**
 * Accessibility props for Pressable acting as a button.
 */
export const asButtonProps = (disabled = false) => ({
  accessible: true,
  accessibilityRole: 'button' as const,
  accessibilityState: { disabled },
});

/**
 * Accessibility props for headings.
 */
export const asHeaderProps = (level?: number) => ({
  accessible: true,
  accessibilityRole: 'header' as const,
  ...(level !== undefined ? { accessibilityLevel: level } : {}),
});

/**
 * Accessibility props for tabs.
 */
export const asTabProps = (selected = false) => ({
  accessible: true,
  accessibilityRole: 'tab' as const,
  accessibilityState: { selected },
});

export default {
  ensureMinTouchTarget,
  asButtonProps,
  asHeaderProps,
  asTabProps,
};
