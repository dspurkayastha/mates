/**
 * Glass Components Demo
 * Showcase of iOS 26 glassmorphism design language implementation
 * Features all glass components with examples of different configurations
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  GlassView, 
  GlassButton, 
  GlassCard, 
  GlassToggle, 
  GlassInput, 
  GlassModal,
  Text
} from '../components/ui';
import { useColors, useTokens } from '../design-system/ThemeProvider';

export default function GlassComponentsDemo() {
  const colors = useColors();
  const tokens = useTokens();
  
  // State for demo components
  const [toggleValue, setToggleValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="titleLarge" weight="bold" style={styles.title}>
          iOS 26 Glass Components
        </Text>
        
        <Text variant="bodyMedium" color={colors.text.secondary} style={styles.subtitle}>
          Experience the latest glassmorphism design language
        </Text>

        {/* Glass Buttons Section */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Glass Buttons
          </Text>
          
          <View style={styles.buttonRow}>
            <GlassButton 
              variant="primary" 
              buttonStyle="tinted" 
              size="medium"
              style={styles.button}
            >
              Primary
            </GlassButton>
            
            <GlassButton 
              variant="secondary" 
              buttonStyle="outlined" 
              size="medium"
              style={styles.button}
            >
              Outlined
            </GlassButton>
          </View>
          
          <GlassButton 
            variant="success" 
            buttonStyle="filled" 
            size="large"
            fullWidth
            style={styles.fullButton}
          >
            Success Button
          </GlassButton>
        </View>

        {/* Glass Cards Section */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Glass Cards
          </Text>
          
          <GlassCard 
            variant="translucent" 
            size="medium" 
            interactive={true}
            style={styles.card}
          >
            <Text variant="labelMedium" weight="medium">
              Interactive Glass Card
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary} style={{ marginTop: 4 }}>
              Tap me to see the glass ripple effect
            </Text>
          </GlassCard>
          
          <GlassCard 
            variant="outlined" 
            size="small" 
            style={styles.card}
          >
            <Text variant="labelSmall" weight="medium">
              Outlined Card
            </Text>
            <Text variant="bodySmall" color={colors.text.tertiary}>
              Static card with glass border
            </Text>
          </GlassCard>
        </View>

        {/* Glass Input Section */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Glass Input
          </Text>
          
          <GlassInput
            label="Glass Input Field"
            placeholder="Enter text here..."
            value={inputValue}
            onChangeText={setInputValue}
            helperText="This input has a beautiful glass background"
            style={styles.input}
          />
        </View>

        {/* Glass Toggle Section */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Glass Toggle
          </Text>
          
          <View style={styles.toggleRow}>
            <Text variant="bodyMedium">
              Enable glassmorphism
            </Text>
            <GlassToggle
              value={toggleValue}
              onValueChange={setToggleValue}
              variant="primary"
              size="medium"
            />
          </View>
        </View>

        {/* Glass Modal Section */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Glass Modal
          </Text>
          
          <GlassButton 
            variant="primary" 
            buttonStyle="tinted" 
            onPress={() => setModalVisible(true)}
            style={styles.modalButton}
          >
            Show Glass Modal
          </GlassButton>
        </View>

        {/* Glass View Demo */}
        <View style={styles.section}>
          <Text variant="labelLarge" weight="semibold" style={styles.sectionTitle}>
            Custom Glass View
          </Text>
          
          <GlassView 
            intensity="thick" 
            tint="systemMaterial"
            style={styles.customGlass}
            shadowEnabled
            shadowIntensity="strong"
          >
            <Text variant="labelMedium" weight="medium" style={{ textAlign: 'center' }}>
              Custom Glass Container
            </Text>
            <Text variant="bodySmall" color={colors.text.secondary} style={{ textAlign: 'center', marginTop: 8 }}>
              You can use GlassView to create any custom glass UI element
            </Text>
          </GlassView>
        </View>
      </ScrollView>

      {/* Glass Modal */}
      <GlassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="medium"
        position="center"
        glassIntensity="regular"
        showHandle={false}
      >
        <View style={styles.modalContent}>
          <Text variant="titleMedium" weight="bold" style={{ textAlign: 'center' }}>
            Glass Modal
          </Text>
          <Text variant="bodyMedium" color={colors.text.secondary} style={{ textAlign: 'center', marginTop: 8 }}>
            This is a beautiful glass modal with iOS 26 styling
          </Text>
          
          <GlassButton 
            variant="primary" 
            buttonStyle="tinted" 
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 24 }}
            fullWidth
          >
            Close Modal
          </GlassButton>
        </View>
      </GlassModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
  },
  fullButton: {
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButton: {
    alignSelf: 'center',
  },
  customGlass: {
    padding: 20,
    borderRadius: 16,
  },
  modalContent: {
    padding: 24,
  },
});