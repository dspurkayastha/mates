# Executive Summary
- Hard-coded colors and overflow clipping break theming, leaving large portions of the UI in flat white/gray.
- Core expense, grocery, and chore flows are placeholders with no settle, lifecycle, or assignment logic.
- Settings toggles only update local state; profile logout does not clear caches or Supabase session fully.
- React Query hooks are unscoped by group/user and screens lack error handling.
- Accessibility gaps (FloatingActionMenu) and minimal test coverage limit production readiness.
- **Risk Score: High**

# Findings
| ID | Severity | Area | File(s):line(s) | Evidence | Impact | Proposed Fix |
| --- | --- | --- | --- | --- | --- | --- |
| THEME-COLOR-01 | P0 | Theming | apps/mobile/src/app/+not-found.tsx:228-334 | Hard-coded `#fff`, `#e5e5e5`, `#666` styles【F:apps/mobile/src/app/+not-found.tsx†L228-L334】 | Overrides theme tokens, causing white/gray surfaces | Replace with `useColors`/`useTokens` values |
| THEME-SHADOW-01 | P0 | Theming | apps/mobile/src/components/FloatingActionMenu.jsx:161-170 | `shadowColor: '#000'`【F:apps/mobile/src/components/FloatingActionMenu.jsx†L161-L170】 | Non-token shadow color breaks dark mode | Use `tokens.Shadows` and theme shadow colors |
| THEME-CLIP-01 | P1 | Theming | apps/mobile/src/components/ui/SearchBar.tsx:614-620 | `overflow: 'hidden'` on results card【F:apps/mobile/src/components/ui/SearchBar.tsx†L614-L620】 | Clips shadows/gradients | Remove overflow or wrap inner view |
| THEME-CLIP-02 | P1 | Theming | apps/mobile/src/app/polls/[id].tsx:80-106 | Progress bars set `overflow: 'hidden'`【F:apps/mobile/src/app/polls/[id].tsx†L80-L106】 | Bars lose shadows/tints | Use inner wrapper for clipping |
| EXP-LOGIC-01 | P0 | Expenses | apps/mobile/src/app/(tabs)/expenses.jsx:39-49 | Placeholder comments for filter/add/settle flows【F:apps/mobile/src/app/(tabs)/expenses.jsx†L39-L49】 | No split/settle/budget logic | Implement settle, split, owes/owed, budget mutations |
| GROC-LIFECYCLE-01 | P0 | Groceries | apps/mobile/src/app/(tabs)/groceries.jsx:46-73 | Alerts instead of item lifecycle persistence【F:apps/mobile/src/app/(tabs)/groceries.jsx†L46-L73】 | Needed→Bought flow not stored | Add item form, status updates, DB fields |
| CHORE-ASSIGN-01 | P0 | Chores | apps/mobile/src/app/(tabs)/chores.tsx:66-69 | Add chore handler only logs【F:apps/mobile/src/app/(tabs)/chores.tsx†L66-L69】 | Cannot create/assign chores | Implement add/assign modal with mutation |
| SETTING-THEME-01 | P0 | Settings | apps/mobile/src/app/(tabs)/settings.jsx:129-153 | Toggles only set state with "In a real app" comments【F:apps/mobile/src/app/(tabs)/settings.jsx†L129-L153】 | Dark mode/haptics/biometrics not persisted | Wire toggles to ThemeProvider & user prefs |
| PROFILE-LOGOUT-01 | P0 | Profile/Auth | apps/mobile/src/app/(tabs)/profile.jsx:165-168 | `signOut()` without cache clear【F:apps/mobile/src/app/(tabs)/profile.jsx†L165-L168】 | Stale queries after logout | Invalidate React Query caches, clear storage |
| DATA-SCOPE-01 | P1 | Data Layer | apps/mobile/src/hooks/useExpenses.ts:23-33 | Query lacks group/user filters【F:apps/mobile/src/hooks/useExpenses.ts†L23-L33】 | Fetches all rows; security risk | Parameterize by groupId/userId in key & query |
| ACCESS-FAB-01 | P1 | Accessibility | apps/mobile/src/components/FloatingActionMenu.jsx:176-193 | Icon-only buttons without labels【F:apps/mobile/src/components/FloatingActionMenu.jsx†L176-L193】 | Screen readers cannot announce actions | Add `accessibilityLabel`/`role` to each button |
| TEST-COVERAGE-01 | P2 | Testing | apps/mobile/__tests__/basic.test.ts:1-5 | Only trivial arithmetic test【F:apps/mobile/__tests__/basic.test.ts†L1-L5】 | No regression safety | Add tests for domain logic & hooks |

# Why Colors/Tints/Gradients Fail
- Hard-coded colors in `+not-found.tsx` bypass ThemeProvider tokens, forcing white/gray UI surfaces【F:apps/mobile/src/app/+not-found.tsx†L228-L334】.
- `FloatingActionMenu.jsx` uses a raw black shadow instead of theme shadows【F:apps/mobile/src/components/FloatingActionMenu.jsx†L161-L170】.
- `overflow: 'hidden'` on components (SearchBar, poll result bars) clips shadows and tints【F:apps/mobile/src/components/ui/SearchBar.tsx†L614-L620】【F:apps/mobile/src/app/polls/[id].tsx†L80-L106】.
- Screens rely on plain `backgroundColor` instead of gradient primitives despite `expo-linear-gradient` being available.
- ThemeProvider is correctly mounted in `_layout.jsx`, so inconsistencies stem from components bypassing tokens rather than provider setup.

# Screen-by-Screen Consistency Gaps
| Screen | Header | Segmented controls | ListItem usage | Badges/toggles | Cards | Spacing/radius/shadow | Theming |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | Missing standard header | Missing | OK | Missing | OK | OK | Missing gradient |
| Expenses | OK | Missing (uses Buttons) | OK | OK | OK | OK | Missing gradient |
| Groceries | OK | Missing | OK | OK | OK | OK | OK |
| Chores | OK | OK | OK | OK | Missing | OK | OK |
| Profile | OK | Missing | OK | Missing | OK | OK | OK |
| Settings | OK | Missing | Missing (custom cards) | OK | OK | OK | Toggles not wired |
| Polls Create | OK | Missing | Missing | Missing | Missing | OK | Missing gradient |
| Poll Results | OK | Missing | Missing | Missing | OK | Clipped bars | Missing gradient |

# Feature Gaps & Required Modals/Screens
- **Add/Edit Expense & Settle Flow**
  - Acceptance Criteria: create expense with splits, mark settled, maintain audit trail.
  - API Touchpoints: `expenses`, `expense_splits`, `settlements` tables in Supabase.
- **Monthly Budgets**
  - Acceptance Criteria: create/update budget per month and track spend.
  - API Touchpoints: `budgets` table with `month`, `limit`, `spent` fields.
- **Add Grocery Item**
  - Acceptance Criteria: form to add item, move between Needed→Bought with persistence.
  - API Touchpoints: `groceries` table (`status`, `added_by`, `purchased_at`).
- **Add/Assign Chore**
  - Acceptance Criteria: create chore, assign member, due date, completion log.
  - API Touchpoints: `chores` table (`assigned_to`, `due_time`, `completed_at`).
- **Poll Create/Vote/Result Enhancements**
  - Acceptance Criteria: limit one vote per user, show dynamic results sheet.
  - API Touchpoints: `polls`, `poll_votes` tables.
- **Logout Modal**
  - Acceptance Criteria: confirm sign-out and clear local caches.
  - API Touchpoints: Supabase `auth.signOut`, React Query cache reset.

# Data Model & Hook Gaps
- Missing domain hooks under `src/features/expenses`, `src/features/groceries`, `src/features/chores` for create/update/settle actions.
- React Query cache keys should include `groupId`/`userId` (e.g., `['expenses', groupId]`).
- Hooks need optimistic updates and error/empty state helpers; expose `useBudget`, `useSettleExpense`, `useAssignChore`, etc.
- Invalidation strategy: invalidate affected `['expenses']`, `['groceries']`, `['chores']` on mutation success.

# Prioritized Action Plan
| Task | Severity | Owner | ETA | Acceptance Criteria |
| --- | --- | --- | --- | --- |
| Replace hard-coded colors in `+not-found.tsx` with tokens | P0 | @ui | S | All styles use `useColors`/`useTokens` |
| Use theme shadows in `FloatingActionMenu` | P0 | @ui | S | No raw `#000`; passes dark mode |
| Remove overflow clipping from SearchBar & poll result bars | P1 | @ui | S | Shadows visible on all cards |
| Implement expense split & settle mutations | P0 | @expenses | M | Users can add expense, split, settle, audit trail stored |
| Add grocery item form and lifecycle persistence | P0 | @groceries | M | Needed→Bought transitions saved in Supabase |
| Add chore creation/assignment modal | P0 | @chores | M | New chores assigned with due dates |
| Wire settings toggles to ThemeProvider and user prefs | P0 | @settings | S | Dark mode/haptics/biometrics persist and affect app |
| Clear caches on logout | P0 | @auth | S | React Query caches cleared after `signOut` |
| Parameterize React Query hooks by group/user IDs | P1 | @data | S | Queries scoped; keys include `groupId`/`userId` |
| Add accessibility labels to FloatingActionMenu buttons | P1 | @a11y | S | Screen readers announce each action |
| Introduce gradient wrapper for screen backgrounds | P1 | @ui | M | Screens use `expo-linear-gradient` or shim |
| Add error & empty states for data screens | P2 | @ui | M | Inline retry cards, no blocking spinners |
| Add telemetry hook for basic screen events | P2 | @infra | M | Hook logs screen views and critical actions |
| Create unit tests for split/settle math & hooks | P2 | @qa | M | Tests cover helpers and React Query hooks |
| Update `docs/routes-map.md` after navigation changes | P2 | @docs | S | Routes map lists all reachable screens |
