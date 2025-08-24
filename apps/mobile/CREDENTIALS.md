# Credentials & Keys Checklist

Add these before building production apps.

---

## 1. Supabase (Cloud Sync & Auth)

| Key | Where to create / find | Where to set | Code references |
|-----|------------------------|--------------|-----------------|
| `SUPABASE URL` (e.g. `https://xxxx.supabase.co`) | Supabase Project → Settings → General | `.env` → `EXPO_PUBLIC_SUPABASE_URL=` | `src/lib/supabase.js` |
| `SUPABASE ANON KEY` | Supabase Project → Settings → API | `.env` → `EXPO_PUBLIC_SUPABASE_ANON_KEY=` | `src/lib/supabase.js` |
| *(optional)* `SUPABASE SERVICE_ROLE_KEY` (server-side functions) | Supabase Settings → API | **Do NOT bundle in app** – store in server / edge functions | planned API calls |

> After adding, run `expo start --clear` so Metro sees new env vars.

---

## 2. RevenueCat (Subscriptions & Premium Gating)

| Key | Where to create | Where to set | Planned code path |
|-----|-----------------|--------------|-------------------|
| `REVENUECAT_PUBLIC_APP_KEY_IOS` | RevenueCat Dashboard → **Apps** → iOS | `.env` | `src/lib/revenuecat.ts` (to be added) |
| `REVENUECAT_PUBLIC_APP_KEY_ANDROID` | RevenueCat Dashboard → **Apps** → Android | `.env` | `src/lib/revenuecat.ts` |
| `ENTITLEMENT_ID` (e.g. `premium`) | RevenueCat Dashboard → Entitlements | hard-code in `/constants/subscriptions.ts` | gating checks |
| Store-specific product IDs (monthly / yearly) | App Store / Google Play | RevenueCat ‑-> Products | paywall components |

---

## 3. Expo & Deep-Link Schemes

| Item | Where to set | Notes |
|------|--------------|-------|
| `scheme` (e.g. `mates`) | `app.json` → `expo.scheme` | Used by `Linking.createURL('/')` in magic-link redirect |
| `redirect URLs` | Supabase Auth → Settings → Redirect URLs | Add `mates://*`, `https://auth.expo.io/*`, and your web domain |

---

## 4. General Environment Variables

| Variable | Code reference | Purpose |
|----------|----------------|---------|
| `EXPO_PUBLIC_PROXY_BASE_URL` | legacy auth (may deprecate) | Old WebView auth |
| `EXPO_PUBLIC_BASE_URL` | legacy fetch polyfill | API base if kept |
| `EXPO_PUBLIC_HOST` | legacy fetch polyfill | Host header |
| `EXPO_PUBLIC_PROJECT_GROUP_ID` | local storage key prefix | Auth / storage naming |

*(Remove if migrating fully to Supabase.)*

---

## 5. Optional Integrations

### Uploadcare (image upload)

| Variable | Code reference | Purpose |
|----------|----------------|---------|
| `EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY` | `src/utils/useUpload.js` | Uploadcare library init |
| `EXPO_PUBLIC_BASE_CREATE_USER_CONTENT_URL` | `src/utils/useUpload.js` | CDN base for uploaded files |

### Google Maps

| Variable | Code reference | Purpose |
|----------|----------------|---------|
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | `polyfills/web/maps.web.jsx` | Web maps loader |

---

## 6. UPI Deep-Link Targets

No API keys required – we build intent URLs at runtime.

Supported packages:
- Google Pay: `upi://pay`scheme (`com.google.android.apps.nbu.paisa.user`)
- PhonePe: `phonepe://pay`
- Paytm: `paytm://upi/pay`
- CRED UPI: `cred://upi/pay`

> Paths will be added in `src/utils/upi.ts` helper.

---

### How to add `.env`

Create `apps/mobile/.env` (git-ignored):

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx
EXPO_PUBLIC_UPLOADCARE_PUBLIC_KEY=
EXPO_PUBLIC_BASE_CREATE_USER_CONTENT_URL=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
REVENUECAT_PUBLIC_APP_KEY_IOS=
REVENUECAT_PUBLIC_APP_KEY_ANDROID=
```

Restart Metro after editing.

---
