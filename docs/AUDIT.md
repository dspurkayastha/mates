# App Audit Report

## Executive Summary

- **Risk**: Background scene re-registration caused render loops and unstable theming; sign-out left session caches; several screens bypass tokenized theming and a11y rules.
- **User Impact**: Users saw missing icons, FAB hidden under tab bar, and modal actions that never opened. Settings toggles did not persist.
- **Quick Wins**: Idempotent background registration, valid lucide icons, raised FAB, wired placeholder modals, persisted settings toggles, and cache-aware sign-out.
- **Blockers**: React Query hooks without group scoping, remaining alert-based flows, and incomplete accessibility labels hinder production readiness.

## App Flow Audit

### Onboarding / Login

- `app/(onboarding)/welcome.jsx` renders welcome screen and AsyncStorage-driven skip logic.
- `app/login.tsx` provides basic auth form but lacks biometric integration.

### Tab Flow

- **Home**: Header, summary cards, FAB actions. Background via `useSceneBackground`.
- **Analytics**: KPI cards and charts; uses expenses/groceries/chores queries.
- **Profile**: Management cards, edit modal, sign-out confirmation.
- **Settings**: Account, appearance, notification toggles.
- **Expenses/Groceries/Chores**: List screens with loading skeletons but modal triggers still stubs.

### Create/Update Flows

- FAB triggers placeholder modals for expenses/groceries/chores.
- Poll creation screen reachable via FAB.
- Settings toggles persist dark mode, haptics, biometrics.

### Theming & A11y

- Many components rely on `useTheme` & `useTokens`, but some hooks lack scoping and token usage.
- Icon-only buttons lacked `accessibilityLabel` (e.g., FloatingActionMenu main FAB).
- Some query hooks miss empty/error states.

## Findings

| ID          | Sev | Area          | File:Line                        | Evidence                                                                                                                        | Impact                                     | Proposed Fix                                            |
| ----------- | --- | ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| BG-LOOP-01  | P0  | Background    | `useSceneBackground.tsx:124-145` | Register always updated state causing re-renders【F:apps/mobile/src/components/ui/background/useSceneBackground.tsx†L124-L145】 | Infinite update depth on focus             | Compare theme hash and skip identical registrations     |
| UI-ICON-01  | P0  | Tabs          | `(tabs)/_layout.jsx:140-146`     | `Icon "Chart"` not in lucide set【F:apps/mobile/src/app/(tabs)/\_layout.jsx†L140-L146】                                         | Runtime warning and missing tab icon       | Use valid `BarChart3` icon                              |
| UI-FAB-01   | P0  | FAB           | `FloatingActionMenu.jsx:161-170` | FAB positioned without zIndex or safe-area offset【F:apps/mobile/src/components/FloatingActionMenu.jsx†L161-L170】              | FAB hidden behind tab bar; actions clipped | Position above insets and raise z-index                 |
| MODAL-01    | P1  | Home Actions  | `index.jsx:143-156`              | FAB actions only showed `Alert` stubs【b6cfa2†L143-L156】                                                                       | Users cannot add expenses/groceries/chores | Wire actions to controlled modals                       |
| SETTINGS-01 | P0  | Settings      | `settings.jsx:23-25,62-67`       | Toggles only set state, no persistence【d36347†L23-L67】                                                                        | Dark mode/haptics/biometrics not saved     | Persist to storage and update ThemeProvider             |
| AUTH-01     | P0  | Auth          | `useAuth.js:59-63`               | signOut failed to clear caches or route【e3ea58†L59-L63】                                                                       | Stale session after logout                 | Clear React Query & storage then navigate to onboarding |
| DATA-01     | P1  | Data          | `features/chores/hooks.ts:45-64` | invalidateQueries uses `['chores']` without group scoping【F:apps/mobile/src/features/chores/hooks.ts†L45-L64】                 | Cross-group cache pollution                | Include group/user id in query keys                     |
| A11Y-01     | P1  | Accessibility | `FloatingActionMenu.jsx:224-229` | Main FAB missing label【48a144†L223-L229】                                                                                      | Screen readers cannot announce action      | Add `accessibilityLabel`                                |
| TEST-01     | P2  | Tests         | `jest.setup.ts:71-89`            | Custom mocks for navigation & background【966e51†L71-L89】                                                                      | ESM modules mocked but coverage thin       | Expand tests for background & sign-out                  |

## Prioritized Action Plan

### P0 – Unblockers

- **Background hash guard (@ui)**: Idempotent register and memoized themes.
- **Auth cleanup (@auth)**: Cache-clearing sign-out with navigation.
- **Settings persistence (@settings)**: Store dark mode, haptics, biometrics.
- **FAB surface (@ui)**: Safe-area aware position and labeled actions.

### P1 – UX / Parity

- **Modal forms (@ui)**: Replace Alerts with real forms or placeholders across tabs.
- **Data scoping (@data)**: Ensure all React Query keys include group/user identifiers.
- **Accessibility sweep (@a11y)**: Label remaining icon buttons; verify 44×44 targets.

### P2 – Polish

- **Empty & error states (@ui)**: Consistent components across lists.
- **Test coverage (@qa)**: Add RTL tests for background transitions and sign-out.
- **Theme audit (@ui)**: Remove residual hard-coded colors and shadow clipping.
