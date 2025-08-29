/**
 * Empty State Component
 * Displays helpful empty states with actions
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';
import Button from './Button';
import Icon from './Icon';

// ============================================================================
// TYPES
// ============================================================================

interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: string;
}

interface EmptyStateProps {
  type?: 'empty' | 'error' | 'search' | 'network';
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  style?: ViewStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title,
  description,
  actions = [],
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  const getIcon = () => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'search':
        return 'Search';
      case 'network':
        return 'WifiOff';
      default:
        return 'Package';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      default:
        return 'tertiary';
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: tokens.Spacing['2xl'],
        },
        style,
      ]}
    >
      <Icon
        name={getIcon() as any}
        size="2xl"
        color={getIconColor() as any}
        style={{ marginBottom: tokens.Spacing.lg }}
      />
      
      <Text
        variant="titleLarge"
        color="primary"
        align="center"
        style={{ marginBottom: tokens.Spacing.md }}
      >
        {title}
      </Text>
      
      <Text
        variant="bodyMedium"
        color="secondary"
        align="center"
        style={{ marginBottom: tokens.Spacing.lg, maxWidth: 280 }}
      >
        {description}
      </Text>

      {actions.length > 0 && (
        <View style={{ gap: tokens.Spacing.sm, width: '100%', maxWidth: 200 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              size="medium"
              fullWidth
              onPress={action.onPress}
              leftIcon={action.icon ? <Icon name={action.icon as any} size="sm" /> : undefined}
            >
              {action.label}
            </Button>
          ))}
        </View>
      )}
    </View>
  );
};

export default EmptyState;