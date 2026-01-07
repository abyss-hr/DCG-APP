# Dependency Notes (Non-Expo)

Goal: quick reference for **third-party dependencies** that are not part of the basic Expo/React Native runtime.

Notes:
- “Where used” points to one or two representative files (not an exhaustive list).
- If something is marked “unused”, it is installed in `package.json` but not currently imported in the app code.

## Runtime dependencies

- **@expo/vector-icons** — Icon packs (Feather/Ionicons) used throughout UI.
  - Where used: [src/components/modals/CategoryPickerModal.tsx](src/components/modals/CategoryPickerModal.tsx), [app/(drawer)/_layout.tsx](app/(drawer)/_layout.tsx)

- **@react-native-async-storage/async-storage** — Persistent local storage (favorites, theme, offline cache, etc.).
  - Where used: [src/utils/storageUtils.ts](src/utils/storageUtils.ts), [src/components/context/FavoritesContext.tsx](src/components/context/FavoritesContext.tsx)

- **@react-native-community/netinfo** — Network connectivity status; used for offline mode / slow network handling.
  - Where used: [src/components/context/OfflineContext.tsx](src/components/context/OfflineContext.tsx)

- **@react-navigation/native** + **@react-navigation/drawer** — Navigation primitives used alongside Expo Router’s drawer integration.
  - Where used: [app/(drawer)/_layout.tsx](app/(drawer)/_layout.tsx)

- **dotenv** — Loads local `.env` for Node contexts (used by Expo config).
  - Where used: [app.config.js](app.config.js)

- **firebase** — Firebase SDK (Firestore + Storage) for app data.
  - Where used: [src/database/firebaseConfig.ts](src/database/firebaseConfig.ts), [src/database/categoryService.ts](src/database/categoryService.ts)

- **haversine-distance** — Calculates distance between two GPS coordinates.
  - Where used: [src/utils/distanceUtils.ts](src/utils/distanceUtils.ts)

- **lucide-react-native** — Icon library used heavily in listing UI.
  - Where used: [src/theme/icons.ts](src/theme/icons.ts), [src/pages/listing/content/ListingInfoCard.tsx](src/pages/listing/content/ListingInfoCard.tsx)

- **react-native-reanimated-carousel** — Carousel component (used for listing image gallery).
  - Where used: [src/pages/listing/media/images/ListingGallery.tsx](src/pages/listing/media/images/ListingGallery.tsx)

- **react-native-worklets** — Worklets support; enabled via Babel plugin (often used by animation libraries).
  - Where configured: [babel.config.js](babel.config.js)

- **react-native-youtube-iframe** — Embeds YouTube videos.
  - Where used: [src/pages/listing/media/video/ListingVideo.tsx](src/pages/listing/media/video/ListingVideo.tsx)

## Installed but not currently referenced (candidate to remove)

- **react-native-dotenv** — Not found in code/config; `dotenv` is currently used via [app.config.js](app.config.js).
- **react-native-swiper** — Not found in code.
- **react-native-webview** — Not found in code (even though it is commonly used for in-app web pages).

## Dev dependencies

- **babel-plugin-module-resolver** — Enables the `@/...` import alias.
  - Where configured: [babel.config.js](babel.config.js)

- **@types/react-native-vector-icons** — Type definitions for icon packages (TypeScript support).
  - Note: types only.

- **react-test-renderer** — React testing renderer.
  - Note: installed, but no tests currently reference it.
