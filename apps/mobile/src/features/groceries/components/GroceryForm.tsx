import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui';
import { FormField, TextInput, Select, CurrencyInput } from '@/components/form';
import { useCreateItem } from '../hooks';

interface Props {
  onSuccess: () => void;
}

export default function GroceryForm({ onSuccess }: Props) {
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID!;
  const createItem = useCreateItem(groupId);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [store, setStore] = useState('');
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({ item: '' });

  const handleSubmit = () => {
    const newErrors = { item: '' };
    if (!item) newErrors.item = 'Required';
    setErrors(newErrors);
    if (newErrors.item) return;
    createItem.mutate(
      { name: item, quantity: qty, note: store /* TODO: persist price */ },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
    <View>
      <FormField label="Item" required error={errors.item}>
        <TextInput value={item} onChangeText={setItem} a11yLabel="Item name" />
      </FormField>
      <FormField label="Quantity">
        <TextInput value={qty} onChangeText={setQty} keyboardType="numeric" a11yLabel="Quantity" />
      </FormField>
      <FormField label="Store">
        <Select
          options={[
            { label: 'Store A', value: 'a' },
            { label: 'Store B', value: 'b' },
          ]}
          value={store}
          onChange={setStore}
          a11yLabel="Store"
        />
      </FormField>
      <FormField label="Price">
        <CurrencyInput value={price} onChange={setPrice} a11yLabel="Price" />
      </FormField>
      <Button onPress={handleSubmit} accessibilityLabel="Save Grocery" variant="primary">
        Save
      </Button>
    </View>
  );
}
