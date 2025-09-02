module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo|@unimodules|unimodules|sentry-expo|native-base|react-navigation|@react-navigation/.*)',
  ],
};
