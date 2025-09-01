import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme, useTokens } from './ui';

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: ViewStyle;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, action, style }) => {
  const { theme: _theme } = useTheme();
  const tokens = useTokens();
  const target = tokens.Spacing['5xl'];

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: target,
          marginBottom: tokens.Spacing.sm,
        },
        style,
      ]}
    >
      <View style={[styles.left, { marginRight: action ? tokens.Spacing.sm : 0 }]}> 
        {icon && <View style={{ marginRight: tokens.Spacing.sm }}>{icon}</View>}
        <Text variant="titleMedium" color="primary" weight="semibold">
          {title}
        </Text>
      </View>
      {action && <View style={styles.right}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SectionHeader;

