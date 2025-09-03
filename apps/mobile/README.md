# Mobile App

## Development

Do not import app code (TS, '@/…') in Metro config; it runs in Node and cannot resolve TS/aliases.

## Debugging

Enable targeted logs: `EXPO_PUBLIC_DEBUG=deeplink,auth`

## Setup

Install `react-native-svg` using `npx expo install react-native-svg` to ensure the Expo SDK-compatible version. The package ships with its own TypeScript types; do not install `@types/react-native-svg`.

## Troubleshooting & CI

- Lockfile sync: prefer `npm ci --no-audit --legacy-peer-deps`. If the lockfile drifts, run `npm install --no-audit --legacy-peer-deps` once and commit `package-lock.json`.
- Peer dependencies are pinned; avoid bumping versions in CI.
- Gated logs: set `EXPO_PUBLIC_DEBUG=deeplink,auth` to enable debug channels.
- Blur is optional at runtime via SafeBlur; if `expo-blur` is missing in dev or test, we render a plain `View`. Do not add `expo-blur` to `app.json` plugins.
