import React from 'react';
import { ViewStyle } from 'react-native';
import Card from './Card';
import ListItem from './ListItem';
import Icon from './Icon';
import { useTheme, useTokens } from '../../design-system/ThemeProvider';

interface NavTileProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const NavTile: React.FC<NavTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const tokens = useTokens();

  return (
    <Card
      variant="elevated"
      interactive
      onPress={onPress}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={subtitle}
      accessibilityRole="button"
      style={{ flex: 1, marginHorizontal: tokens.Spacing.xs, ...(style || {}) }}
    >
      <ListItem
        title={title}
        meta={subtitle}
        density="compact"
        media={<Icon name={icon} size="lg" color="brand" />}
        accessory={{ type: 'chevron' }}
        style={{
          backgroundColor: theme.background.elevated,
          borderBottomWidth: 0,
          marginHorizontal: -tokens.Spacing.lg,
          marginVertical: -tokens.Spacing.lg,
        }}
      />
    </Card>
  );
};

export default NavTile;
