import React from 'react';
import { View } from 'react-native';

let RealBlur: React.ComponentType<any> | null = null;

try {
  require.resolve('expo-blur');
  RealBlur = require('expo-blur/build/BlurView').BlurView;
} catch {}

function MissingModuleError() {
  return new Error("expo-blur is missing. Install it with 'npx expo install expo-blur'.");
}

export const BlurView: React.FC<any> = (props) => {
  if (RealBlur) {
    const Comp = RealBlur as React.ComponentType<any>;
    return <Comp {...props} />;
  }
  if (__DEV__) {
    console.warn('expo-blur not installed; falling back to <View>.');
    return <View {...props} />;
  }
  throw MissingModuleError();
};

export default BlurView;
