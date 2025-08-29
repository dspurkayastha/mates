/**
 * Modern Icon Component
 * Unified icon component using Lucide React Native
 * Supports consistent sizing, colors, and accessibility
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { icons, LucideIcon } from 'lucide-react-native';
import { useColors } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type IconName = keyof typeof icons;
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ColorVariant = 
  | 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'brand'
  | 'success' | 'warning' | 'error' | 'info';

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: ColorVariant | string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  testID?: string;
}

// ============================================================================
// SIZE MAPPING
// ============================================================================

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'primary',
  style,
  accessibilityLabel,
  accessibilityElementsHidden,
  importantForAccessibility = 'auto',
  testID,
}) => {
  const colors = useColors();

  // Get icon size
  const getIconSize = (): number => {
    if (typeof size === 'number') return size;
    return sizeMap[size];
  };

  // Get icon color
  const getIconColor = (): string => {
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return color;
    }

    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'inverse':
        return colors.text.inverse;
      case 'brand':
        return colors.text.brand;
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      case 'info':
        return colors.status.info;
      default:
        return colors.text.primary;
    }
  };

  // Get the icon component
  const IconComponent = icons[name] as LucideIcon;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    // Return fallback icon
    const FallbackIcon = icons.Circle as LucideIcon;
    return (
      <FallbackIcon
        size={getIconSize()}
        color={getIconColor()}
        style={style}
        accessibilityLabel={accessibilityLabel || `${name} icon`}
        accessibilityElementsHidden={accessibilityElementsHidden}
        importantForAccessibility={importantForAccessibility}
        testID={testID}
      />
    );
  }

  return (
    <IconComponent
      size={getIconSize()}
      color={getIconColor()}
      style={style}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      testID={testID}
    />
  );
};

// ============================================================================
// COMMON ICON EXPORTS
// ============================================================================

// Export commonly used icons as separate components for better DX
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="House" {...props} />;
export const DollarSignIcon = (props: Omit<IconProps, 'name'>) => <Icon name="DollarSign" {...props} />;
export const ShoppingCartIcon = (props: Omit<IconProps, 'name'>) => <Icon name="ShoppingCart" {...props} />;
export const CheckSquareIcon = (props: Omit<IconProps, 'name'>) => <Icon name="SquareCheck" {...props} />;
export const PlusIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Plus" {...props} />;
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Settings" {...props} />;
export const UserIcon = (props: Omit<IconProps, 'name'>) => <Icon name="User" {...props} />;
export const BellIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Bell" {...props} />;
export const MenuIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Menu" {...props} />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Search" {...props} />;
export const ArrowLeftIcon = (props: Omit<IconProps, 'name'>) => <Icon name="ArrowLeft" {...props} />;
export const ArrowRightIcon = (props: Omit<IconProps, 'name'>) => <Icon name="ArrowRight" {...props} />;
export const CheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Check" {...props} />;
export const XIcon = (props: Omit<IconProps, 'name'>) => <Icon name="X" {...props} />;
export const EyeIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Eye" {...props} />;
export const EyeOffIcon = (props: Omit<IconProps, 'name'>) => <Icon name="EyeOff" {...props} />;
export const LockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Lock" {...props} />;
export const UnlockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="LockOpen" {...props} />;

export default Icon;