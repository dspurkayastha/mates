/**
 * Voice Control System
 * Accessibility-focused voice commands and speech synthesis
 */

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import { Text, Card, Button, Icon } from '../../components/ui';

// ============================================================================
// VOICE CONTROL MANAGER
// ============================================================================

class VoiceControlManager {
  private static instance: VoiceControlManager;
  private commands: Map<string, () => void> = new Map();
  private settings = { enabled: false, language: 'en-US', rate: 1.0 };

  static getInstance(): VoiceControlManager {
    if (!VoiceControlManager.instance) {
      VoiceControlManager.instance = new VoiceControlManager();
    }
    return VoiceControlManager.instance;
  }

  async initialize(): Promise<boolean> {
    this.registerCommands();
    await this.loadSettings();
    return true;
  }

  private registerCommands(): void {
    this.commands.set('go home', () => console.log('Navigate to home'));
    this.commands.set('open settings', () => console.log('Navigate to settings'));
    this.commands.set('add expense', () => console.log('Add expense'));
    this.commands.set('help', () => this.showHelp());
  }

  async speak(text: string): Promise<void> {
    if (!this.settings.enabled) return;
    
    try {
      await Speech.speak(text, {
        language: this.settings.language,
        rate: this.settings.rate,
      });
    } catch (error) {
      console.error('Speech failed:', error);
    }
  }

  processCommand(transcript: string): boolean {
    const command = this.commands.get(transcript.toLowerCase().trim());
    if (command) {
      command();
      this.speak('Command executed');
      return true;
    }
    
    this.speak('Command not recognized');
    return false;
  }

  private showHelp(): void {
    this.speak('Available commands: go home, open settings, add expense, help');
  }

  async updateSettings(newSettings: Partial<typeof this.settings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await AsyncStorage.setItem('@voice_settings', JSON.stringify(this.settings));
  }

  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('@voice_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load voice settings');
    }
  }

  getSettings() { return { ...this.settings }; }
}

// ============================================================================
// VOICE WIDGET COMPONENT
// ============================================================================

export const VoiceControlWidget: React.FC = () => {
  const colors = useColors();
  const tokens = useTokens();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    voiceControlManager.initialize();
  }, []);

  const handleToggle = async () => {
    setIsActive(!isActive);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!isActive) {
      voiceControlManager.speak('Voice control activated');
    } else {
      voiceControlManager.speak('Voice control deactivated');
    }
  };

  return (
    <View style={{ position: 'absolute', bottom: 160, right: 20, zIndex: 100 }}>
      <Button
        variant={isActive ? 'primary' : 'secondary'}
        size="large"
        onPress={handleToggle}
        style={{ borderRadius: tokens.BorderRadius.full }}
        accessibilityLabel="Toggle voice control"
      >
        <Icon name={isActive ? 'MicOff' : 'Mic'} size="lg" color={isActive ? 'inverse' : 'primary'} />
      </Button>
    </View>
  );
};

// ============================================================================
// SETTINGS COMPONENT
// ============================================================================

export const VoiceControlSettings: React.FC = () => {
  const tokens = useTokens();
  const [settings, setSettings] = useState(voiceControlManager.getSettings());

  const handleToggle = async () => {
    const newEnabled = !settings.enabled;
    setSettings(prev => ({ ...prev, enabled: newEnabled }));
    await voiceControlManager.updateSettings({ enabled: newEnabled });
  };

  return (
    <Card variant="elevated" style={{ padding: tokens.Spacing.lg }}>
      <Text variant="titleMedium" color="primary" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
        Voice Control
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="bodyMedium" color="primary">Enable Voice Commands</Text>
        <Button
          variant={settings.enabled ? 'primary' : 'secondary'}
          size="small"
          onPress={handleToggle}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </Button>
      </View>
      
      <Button
        variant="secondary"
        size="medium"
        fullWidth
        onPress={() => voiceControlManager.speak('Voice control test successful')}
        style={{ marginTop: tokens.Spacing.md }}
      >
        Test Voice
      </Button>
    </Card>
  );
};

export const voiceControlManager = VoiceControlManager.getInstance();

export default { VoiceControlWidget, VoiceControlSettings, voiceControlManager };