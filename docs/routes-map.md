# Routes Map

| Route | Type | File Path | Notes |
| --- | --- | --- | --- |
| `/` | Stack entry | apps/mobile/src/app/index.jsx | Redirects to onboarding or tabs |
| `/login` | Stack screen | apps/mobile/src/app/login.tsx | Imports `screens/LoginScreen` |
| `/register` | Stack screen | apps/mobile/src/app/register.tsx | User registration |
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
