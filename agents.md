# agents.md

## 0) Mission
Ship a **world-class, premium** React Native (Expo) app with a **quirky-yet-refined, Gen-Z** tone that does **not** look AI-generated. Raise visual quality, motion, a11y, performance, and production readiness.

---

## 1) Ground rules
- **Use existing theme/tokens only.** Get colors & state from `useTheme()` → `theme.*` and tokens from `useTokens()` → `DesignTokens` (`Typography`, `Spacing`, `BorderRadius`, `Shadows`, `Animation`, `Breakpoints`, `GlassmorphismTokens`).
- **No new token files or theme shapes.** If truly needed, make the smallest additive change to `DesignTokens` with rationale.
- **Pressable + Reanimated.** Use `withTiming` for micro-interactions (no bouncy `withSpring` for presses). Easing = `Easing.bezier(0.2, 0.8, 0.2, 1)`. Press scale = `DesignTokens.Animation.press.scale` (0.98).
- **Glass is secondary.** Use `GlassmorphismTokens` only for overlays/announcements, not primary content cards.
- **Shadow safety.** If a container needs a shadow, **do not** set `overflow: 'hidden'` on that container; wrap content in an inner clipped view.
- **Spacing & type.** 8-pt rhythm via `Spacing`; radii 12–24 via `BorderRadius`; use `Typography.title/*`, `body/*`, `label/*`.
- **A11y.** Roles/labels/hints for all pressables; visible focus states; contrast ≥ 4.5:1 for text.
- **Perf.** Virtualize long lists; memoize rows; pre-size images; avoid heavy blurs/elevation.

---

## 2) Aesthetic spec
**Do**
- Neutral duotone surfaces + a single playful accent (`theme.interactive.primary` / `theme.text.brand`).
- Hairline borders using `theme.border.light` (or `StyleSheet.hairlineWidth`).
- Subtle depth (`Shadows.sm/md/lg`), clean whitespace, natural motion **≤180ms in / ≤140ms out**.

**Don't**
- Neon/rainbow floods; heavy glass on main surfaces; springy/bouncy presses; blocky corners; clipped shadows.

---

## 3) Integration & architecture policy
- **No orphans/duplicates.** Every screen must be reachable from navigation; remove or merge duplicates (e.g., `tabs/settings` vs `screens/SettingsScreen` → one canonical Settings).
- **Auth unification.** Merge overlapping Auth flows (AuthModal/Login/SignUp). One set of screens + a single source of truth for helpers.
- **Polls.** Provide dedicated screens: `CreatePollScreen`, `PollResultsScreen`; wire from dashboard banner; keep placeholder data if backend not ready.
- **Routes map.** Maintain a `docs/routes-map.md` generated during audits listing stacks, tabs, and deep links.
- **Feature flags.** If a feature is not ready, guard it behind a flag but keep UI consistent.

---

## 4) Known issues to fix (must be cleared before UI polish)
- Reanimated error: **"Interpolation input and output ranges should contain at least two values."** (present in Settings tab). Replace any single-value `interpolate(...)` or remove it.
- Duplicated screens (e.g., Settings) and duplicated auth code paths (AuthModal/Login).
- Shadow clipping on cards; inconsistent badge sizes; overuse of glass for primary content.

---

## 5) Component standards (definition of "done")
- **Card v2**
  - Outer: `Shadows.md|lg`, no overflow.
  - Inner: border = hairline (`theme.border.light`), padding = `Spacing.lg`, radius = `BorderRadius.lg`.
  - Variants: `elevated|outlined|filled`; `glass` only for overlays/announcements.
  - Interactive: press scale `0.98`, durations from `Animation.duration`, haptics light.

- **Button v2**
  - Variants: `primary|secondary|ghost|destructive`; sizes `sm|md|lg`.
  - Focus ring 2px using brand color; disabled opacity 0.5.

- **Badge v2**
  - Variants: `neutral|positive|warn|danger` (+ `quiet` outline). Height 22–26, rounded-full.

- **ListItem v2**
  - Left media 36–40, title + meta, right accessory (chevron/toggle/badge). Density `comfortable(16)` / `compact(12)`.

- **Tabs/Segmented**
  - Underlay = tinted panel (`withOpacity(theme.interactive.primary, ~0.03)`), active = accent tint + hairline.

---

## 6) Motion/a11y/perf details
- Respect Reduce Motion (`useTheme().accessibility.isReduceMotionEnabled`) → skip transforms or cut durations ≤80ms.
- Minimum touch targets 44×44.
- No console warnings (including Reanimated) permitted in PRs.

---

## 7) PR requirements
- **Diff-only** code blocks with file paths and a brief rationale.
- Tests updated (unit/snapshot for primitives; RTL for flows where touched).
- Keep navigation/business logic intact; no new deps without justification.

---

## 8) Acceptance checklist (apply to every PR)
1. Matches aesthetic spec; no blockiness/glass abuse.  
2. Only uses `theme.*` and `DesignTokens`; no hard-coded colors/radii/shadows.  
3. Press interactions use `withTiming` + `Easing.bezier(0.2,0.8,0.2,1)`.  
4. a11y roles/labels/focus; contrast passes.  
5. No shadow clipping; lists virtualized; no heavy blur.  
6. No Reanimated warnings; TypeScript clean; tests green.  
7. Routes map updated; no orphan screens or duplicates.