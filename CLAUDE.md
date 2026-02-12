# Ihssan Tracker — CLAUDE.md

## Project Overview

**Ihssan Tracker** is a privacy-first React Native (Expo) mobile app for Muslims to track daily spiritual habits: Salat, Adhkar, Quran reading, Tahajjud, Charity, and custom habits. All data is stored locally on-device with no backend.

## Tech Stack

- **Framework**: React Native 0.81 via Expo SDK 54 (New Architecture enabled)
- **Language**: TypeScript 5.9
- **State Management**: Zustand 5 with AsyncStorage persist middleware
- **Navigation**: React Navigation v7 (bottom tabs + native stack)
- **Internationalization**: i18next + react-i18next (English & Arabic/RTL)
- **Animations**: react-native-reanimated 4
- **Charts**: victory-native
- **Prayer times**: adhan library
- **Fonts**: Expo Google Fonts (Amiri, Cairo, Inter, Noto Sans Arabic)

## Project Structure

```
src/
  components/       # Shared UI components (Card, Chip, PrayerPill, modals, etc.)
  screens/          # All screen-level components
    auth/           # LoginScreen, SignUpScreen
    social/         # SocialScreen, GroupDetails, CreateGroup, JoinGroup
  store/            # Zustand stores (habits, salat, user prefs, social, auth, khatam)
  navigation/       # RootNavigator, MainTabs
  theme/            # colors.ts, typography.ts, spacing.ts, index.ts
  i18n/             # i18next setup + locales (en.json, ar.json)
  hooks/            # Custom hooks (usePrayerTimes, etc.)
  services/         # prayerTimes, notifications, analytics, export
  utils/            # dateUtils, streakUtils, qibla, formatting, fonts
  types/            # Shared TypeScript types
  data/             # Static content (adhkarContent, duaContent)
  context/          # ThemeContext (light/dark mode)
```

## Key Conventions

### Theming
- Always use `useTheme()` from `ThemeContext` — never hardcode colors.
- Color tokens live in `src/theme/colors.ts`. Light/dark variants are defined there.
- Use `AppBackground` and `AppCard` wrappers for consistent surface styling.

### State Management
- Each domain has its own Zustand store in `src/store/`.
- Stores use AsyncStorage persist middleware — be careful with store shape migrations.
- Import stores from `src/store/index.ts`.

### Internationalization
- All user-facing strings must go through `i18next` (`t('key')`).
- Locale files: `src/i18n/locales/en.json` and `ar.json`.
- The app supports Arabic RTL — always test layout in RTL mode.

### Navigation
- Bottom tab navigator defined in `src/navigation/MainTabs.tsx`.
- Root navigator (auth vs. main flow) in `src/navigation/RootNavigator.tsx`.

### Components
- Reusable components export from `src/components/index.ts`.
- Screens export from `src/screens/index.ts`.

## Dev Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

## Important Notes

- **No backend / no network calls** — everything is local AsyncStorage.
- **Portrait orientation only** (locked in app.json).
- **New Architecture is enabled** (`newArchEnabled: true`) — avoid libraries incompatible with it.
- **Android edge-to-edge** is enabled; account for system bars in layouts.
- Predictive back gesture is disabled on Android (`predictiveBackGestureEnabled: false`).
