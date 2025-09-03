const modules = [
  'expo-blur',
  'expo-linear-gradient',
  'react-native-svg',
  'react-native-reanimated',
  '@react-navigation/native',
];

const missing = [];

for (const mod of modules) {
  try {
    require.resolve(mod);
  } catch {
    missing.push(mod);
  }
}

if (missing.length) {
  const fix = `npx expo install ${missing.join(' ')}`;
  const message = `Missing required dependencies: ${missing.join(', ')}\nFix: ${fix}`;
  if (process.env.CI || process.env.NODE_ENV === 'production') {
    console.error(message);
    process.exit(1);
  } else {
    console.warn(message);
  }
}
