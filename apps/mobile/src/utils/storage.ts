import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  haptics: '@mates_haptics',
  biometrics: '@mates_biometrics',
  theme: '@mates_app_theme',
  contrast: '@mates_app_contrast',
};

export const clearAppStorage = async () => {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
};

export default {
  STORAGE_KEYS,
  clearAppStorage,
};
