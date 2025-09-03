import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui';
import { FormField, TextInput, Select, DateTimeField, TextArea } from '@/components/form';
import { useCreateChore } from '../hooks';

interface Props {
  onSuccess: () => void;
}

export default function ChoreForm({ onSuccess }: Props) {
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID!;
  const createChore = useCreateChore(groupId);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [due, setDue] = useState(new Date().toISOString());
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({ title: '' });

  const handleSubmit = () => {
    const newErrors = { title: '' };
    if (!title) newErrors.title = 'Required';
    setErrors(newErrors);
    if (newErrors.title) return;
    createChore.mutate(
      { title, due_at: due, assignee },
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
        <TextInput value={title} onChangeText={setTitle} a11yLabel="Chore title" />
      </FormField>
      <FormField label="Assignee">
        <Select
          options={[
            { label: 'Unassigned', value: '' },
            { label: 'You', value: 'me' },
          ]}
          value={assignee}
          onChange={setAssignee}
          a11yLabel="Assignee"
        />
      </FormField>
      <FormField label="Due" required>
        <DateTimeField value={due} onChange={setDue} a11yLabel="Due date" />
      </FormField>
      <FormField label="Notes">
        <TextArea value={notes} onChangeText={setNotes} a11yLabel="Notes" />
      </FormField>
      <Button onPress={handleSubmit} accessibilityLabel="Save Chore" variant="primary">
        Save
      </Button>
    </View>
  );
}
