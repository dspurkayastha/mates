import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui';
import {
  FormField,
  TextInput,
  CurrencyInput,
  Select,
  DateTimeField,
  TextArea,
} from '@/components/form';
import { useCreateExpense } from '../hooks';

interface Props {
  onSuccess: () => void;
}

export default function ExpenseForm({ onSuccess }: Props) {
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID!;
  const createExpense = useCreateExpense(groupId);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    category: '',
  });

  const handleSubmit = () => {
    const newErrors: typeof errors = { title: '', amount: '', category: '' };
    if (!title) newErrors.title = 'Required';
    if (!amount) newErrors.amount = 'Required';
    if (!category) newErrors.category = 'Required';
    setErrors(newErrors);
    if (newErrors.title || newErrors.amount || newErrors.category) return;
    createExpense.mutate(
      { title, amount, category, created_at: date, notes },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
    <View>
      <FormField label="Title" required error={errors.title}>
        <TextInput value={title} onChangeText={setTitle} a11yLabel="Expense Title" />
      </FormField>
      <FormField label="Amount" required error={errors.amount}>
        <CurrencyInput value={amount} onChange={setAmount} a11yLabel="Amount" />
      </FormField>
      <FormField label="Category" required error={errors.category}>
        <Select
          options={[
            { label: 'General', value: 'general' },
            { label: 'Food', value: 'food' },
            { label: 'Utilities', value: 'utilities' },
          ]}
          value={category}
          onChange={setCategory}
          a11yLabel="Category"
        />
      </FormField>
      <FormField label="Date" required>
        <DateTimeField value={date} onChange={setDate} a11yLabel="Date" />
      </FormField>
      <FormField label="Notes">
        <TextArea value={notes} onChangeText={setNotes} a11yLabel="Notes" />
      </FormField>
      <Button onPress={handleSubmit} accessibilityLabel="Save Expense" variant="primary">
        Save
      </Button>
    </View>
  );
}
