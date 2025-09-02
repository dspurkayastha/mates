# Mobile App

## Debugging

Enable targeted logs: `EXPO_PUBLIC_DEBUG=deeplink,auth`

## Setup

Install `react-native-svg` using `npx expo install react-native-svg` to ensure the Expo SDK-compatible version. The package ships with its own TypeScript types; do not install `@types/react-native-svg`.

## Troubleshooting & CI

- Lockfile sync: prefer `npm ci --no-audit --legacy-peer-deps`. If the lockfile drifts, run `npm install --no-audit --legacy-peer-deps` once and commit `package-lock.json`.
- Peer dependencies are pinned; avoid bumping versions in CI.
- Gated logs: set `EXPO_PUBLIC_DEBUG=deeplink,auth` to enable debug channels.
