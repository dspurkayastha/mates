# Audit: Orphans, Duplicates, Missing & Integration Plan

## Routes Map
| Route | Type | File Path | Notes |
| --- | --- | --- | --- |
| `/` | Stack entry | apps/mobile/src/app/index.jsx | Redirects to onboarding or tabs |
| `/login` | Stack screen | apps/mobile/src/app/login.tsx | Imports `screens/LoginScreen` |
| `/welcome` | Onboarding screen | apps/mobile/src/app/(onboarding)/welcome.jsx | First-run flow |
| `(tabs)` | Tab layout | apps/mobile/src/app/(tabs)/_layout.jsx | Bottom tab navigator |
| `/` (Home tab) | Tab screen | apps/mobile/src/app/(tabs)/index.jsx | Dashboard |
| `/expenses` | Tab screen | apps/mobile/src/app/(tabs)/expenses.jsx | Expenses overview |
| `/groceries` | Tab screen | apps/mobile/src/app/(tabs)/groceries.jsx | Grocery list |
| `/chores` | Tab screen | apps/mobile/src/app/(tabs)/chores.jsx | Chores list |
| `/profile` | Tab screen | apps/mobile/src/app/(tabs)/profile.jsx | User profile |
| `/settings` | Tab screen (hidden) | apps/mobile/src/app/(tabs)/settings.jsx | Pushed from Home/Profile |
| `/create-poll` | Stack screen | apps/mobile/src/app/create-poll.tsx | Create poll form |
| `/poll-results` | Stack screen | apps/mobile/src/app/poll-results.tsx | Active poll results |
| `*` | Fallback | apps/mobile/src/app/+not-found.tsx | Not found screen |
| `mates://auth/callback` | Deep link | apps/mobile/src/utils/auth/DeepLinkHandler.jsx | Supabase magic link handler |

## Orphan Screens/Components
- `apps/mobile/src/screens/AnalyticsScreen.tsx` – dashboard analytics prototype never wired to navigation.
- `apps/mobile/src/screens/GlassComponentsDemo.tsx` – design demo not linked anywhere in app.
- `apps/mobile/src/utils/lazyLoading.tsx` – standalone lazy-loading utility with no imports.

## Duplicates / Near-Duplicates
- No active duplicates in navigation. `CreatePollScreen` and `PollResultsScreen` are routed via thin wrappers in `app/`.

## Missing / Placeholder Screens or Code
- `apps/mobile/src/screens/PollResultsScreen.tsx` shows placeholder "Results coming soon" text.
- `apps/mobile/src/app/(tabs)/profile.jsx` lacks a sign-out action for the current user.

## Merge / Create / Upgrade Plan
- **Remove orphaned demos/utilities**: delete `screens/AnalyticsScreen.tsx`, `screens/GlassComponentsDemo.tsx`, and `utils/lazyLoading.tsx`.
- **Add sign-out to Profile**: import `useAuth` in `app/(tabs)/profile.jsx` and render a destructive `ListItem` at the bottom that calls `signOut()`.
- **Poll results future work**: keep `PollResultsScreen` placeholder until backend is ready; integrate real results when API exists.
