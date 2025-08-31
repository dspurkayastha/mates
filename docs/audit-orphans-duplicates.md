# Audit: Orphans & Duplicates

## Routes Map
See [routes-map.md](./routes-map.md) for full details.

## Orphan Screens/Components
- `apps/mobile/src/screens/AnalyticsScreen.tsx` – dashboard analytics screen with no navigation references.
- `apps/mobile/src/screens/GlassComponentsDemo.tsx` – design demo not linked in navigation.
- `apps/mobile/src/screens/SettingsScreen.tsx` – legacy settings implementation superseded by tab version.
- `apps/mobile/src/utils/lazyLoading.tsx` – standalone lazy-loading system unused across the app.

## Duplicates & Merge Plans
### Settings variants
- **Duplicate:** `app/(tabs)/settings.jsx` vs `screens/SettingsScreen.tsx`.
- **Plan:** Consolidate into a single `apps/mobile/src/app/(tabs)/settings.tsx` using the richer feature set from `SettingsScreen.tsx`. Update pushes from `app/(tabs)/index.jsx` and `app/(tabs)/profile.jsx` to the canonical path and remove imports from `utils/lazyLoading.tsx`.

### Auth flow
- **Duplicate:** Global `AuthModal` (`utils/auth/useAuthModal.jsx`) and separate `LoginScreen` (`screens/LoginScreen.tsx` via `app/login.tsx`).
- **Plan:** Merge into one `apps/mobile/src/app/login.tsx` screen that handles sign-in/sign-up. Refactor callers of `useAuthModal` to navigate to `/login` and remove the modal variant.

