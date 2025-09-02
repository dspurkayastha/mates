import React, { useState } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Text, Card, ListItem, useTokens, useTheme } from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  value?: string;
  onChange: (v: string) => void;
  a11yLabel?: string;
}

export default function Select({ options, value, onChange, a11yLabel }: Props) {
  const [visible, setVisible] = useState(false);
  const tokens = useTokens();
  const { theme } = useTheme();
  const selected = options.find((o) => o.value === value)?.label || 'Select';
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
        <Text>{selected}</Text>
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
          <Card variant="filled" style={{ padding: 0 }}>
            {options.map((o) => (
              <ListItem
                key={o.value}
                title={o.label}
                onPress={() => {
                  onChange(o.value);
                  setVisible(false);
                }}
              />
            ))}
          </Card>
        </View>
      </Modal>
    </>
  );
}
