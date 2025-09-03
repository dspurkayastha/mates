import React from 'react';
import { View } from 'react-native';

// Default to View; swap to BlurView if available
let Impl: React.ComponentType<any> = View;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('expo-blur');
  Impl = mod?.BlurView ?? View;
} catch {
  if (__DEV__ || process.env.JEST_WORKER_ID) {
    console.warn('expo-blur not installed; falling back to <View>.');
  }
}

const SafeBlur: React.FC<any> = (props) => <Impl {...props} />;

export const BlurView = SafeBlur;
export default SafeBlur;
