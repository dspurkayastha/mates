# Contributing

## Setup

- Use Node LTS 18 or 20.
- Install deps with `npm ci --no-audit --legacy-peer-deps`.

## Scripts

- `npm run format:check`
- `npm run lint:colors`
- `npm run typecheck`
- `npm test`
- `npm run orphans`
- `npm run ci:check`

## Branch & PR

- Use feature branches and open pull requests early.
- Keep commits small and descriptive.
- Follow conventional commit style where possible.

## Design System

- No hard-coded colors; rely on theme tokens.
- Use `usePressFeedback` for interactions.
- Wrap screens with `ScreenBackground`.
- Shadows should never be clipped.
