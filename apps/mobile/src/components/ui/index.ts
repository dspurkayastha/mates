/**
 * UI Components Index
 * Export all UI components from a single location
 */

export { default as Text } from './Text';
export { default as Button } from './Button';
export { default as Badge } from './Badge';
export { default as ListItem } from './ListItem';
export { default as Card, CardHeader, CardContent, CardFooter } from './Card';
export { default as LoadingSkeleton } from './LoadingSkeleton';
export { default as EmptyState } from './EmptyState';
export {
  default as Icon,
  HomeIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  CheckSquareIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  BellIcon,
  MenuIcon,
  SearchIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
} from './Icon';
export {
  default as StatusIndicator,
  SuccessStatus,
  ErrorStatus,
  WarningStatus,
  InfoStatus,
  PendingStatus,
  ProcessingStatus,
} from './StatusIndicator';
export { default as ModernBottomSheet, useActionSheet } from './BottomSheet';
export { default as BiometricPrompt, BiometricSetup, BiometricStatus } from './BiometricAuth';

// iOS 26 Glass Components
export { default as GlassView } from './GlassView';
export { default as GlassButton } from './GlassButton';
export { default as GlassCard } from './GlassCard';
export { default as GlassToggle } from './GlassToggle';
export { default as GlassInput } from './GlassInput';
export { default as GlassModal } from './GlassModal';
export { default as ScreenBackground } from './ScreenBackground';

// Re-export design system providers for convenience
export { ThemeProvider, useTheme, useColors, useTokens } from '../../design-system/ThemeProvider';

export { default as SegmentedControl } from './SegmentedControl';
export { default as NavTile } from './NavTile';
export { default as ErrorBanner } from './ErrorBanner';

// Export types for TypeScript users
export type { Theme, ColorScheme } from '../../design-system/ThemeProvider';
