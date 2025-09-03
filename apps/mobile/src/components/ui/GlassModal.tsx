import React from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from './Button';
import Card from './Card';
import { useColors, useTokens } from '../../design-system/ThemeProvider';

type GlassModalProps = {
  visible: boolean;
  onClose: () => void;
  accessibilityLabel?: string;
  children: React.ReactNode;
};

export function GlassModal({ visible, onClose, accessibilityLabel, children }: GlassModalProps) {
  const tokens = useTokens();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingTop: insets.top + tokens.Spacing.lg,
          paddingBottom: insets.bottom + tokens.Spacing.lg,
          paddingHorizontal: tokens.Spacing.lg,
          backgroundColor: colors.background.overlay,
        }}
      >
        <Card variant="elevated" contentStyle={{ padding: tokens.Spacing.lg }}>
          {children}
          <Button
            onPress={onClose}
            accessibilityLabel={accessibilityLabel ?? 'Close modal'}
            style={{ marginTop: tokens.Spacing.lg, alignSelf: 'flex-end' }}
            variant="secondary"
          >
            Close
          </Button>
        </Card>
      </View>
    </Modal>
  );
}

export default GlassModal;
