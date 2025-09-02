import React, { useState } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Text, Card, Button, useTokens, useTheme } from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import { format } from 'date-fns';

interface Props {
  value?: string;
  onChange: (v: string) => void;
  a11yLabel?: string;
}

export default function DateTimeField({ value, onChange, a11yLabel }: Props) {
  const tokens = useTokens();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const date = value ? new Date(value) : new Date();
  const display = format(date, 'dd MMM yyyy, HH:mm');
  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        style={{
          borderWidth: 1,
          borderColor: theme.border.light,
          borderRadius: tokens.BorderRadius.md,
          padding: tokens.Spacing.md,
        }}
      >
        <Text>{display}</Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: withOpacity(theme.text.primary, 0.3),
            justifyContent: 'center',
            padding: tokens.Spacing.lg,
          }}
        >
          <Card variant="filled" style={{ padding: tokens.Spacing.lg }}>
            <Text variant="titleMedium" style={{ marginBottom: tokens.Spacing.md }}>
              Pick Date & Time
            </Text>
            <Button
              variant="primary"
              onPress={() => {
                onChange(new Date().toISOString());
                setVisible(false);
              }}
            >
              Use Current
            </Button>
            <Button
              variant="secondary"
              onPress={() => setVisible(false)}
              style={{ marginTop: tokens.Spacing.sm }}
            >
              Cancel
            </Button>
          </Card>
        </View>
      </Modal>
    </>
  );
}
