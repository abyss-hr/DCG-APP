## App Audit TODOs

### 1. Data & Firebase
- [ ] Document Firebase collections and rules in `DATABASE_FILES.md` (what `listings` contains, indexes, and security rules).
- [ ] Add basic error UI for `useListings` failures (currently only logs to console) in `search.tsx`.
- [ ] Consider caching listing results (e.g. AsyncStorage) for faster cold starts / offline fallback.
- [ ] Add loading/empty states to any screens reusing listings (e.g. future Explore/Admin screens).

### 2. Explore & Admin Screens (currently commented out)
- [ ] Restore/replace `ExploreScreen` in `app/(drawer)/(tabs)/explore.tsx` (currently fully commented out) or remove the route if not needed.
- [ ] Decide whether the `AdminHub` screen in `app/(drawer)/admin.tsx` should be active; either wire it back up with new data hooks or delete it.
- [ ] Remove or implement the `TODO` placeholders inside `admin.tsx` (sync trigger, image management, security, config navigation).
- [ ] Clean up unused imports / commented-out hooks in these files once decisions are made.

### 3. Hooks & Context
- [ ] Remove unused hook `useUserLocation` in `src/hooks/useUserLocation.ts` (replaced by `LocationContext`) or refactor to use it under the hood.
- [ ] Either implement or remove the placeholder `useLocations` in `src/hooks/useLocations.ts`.
- [ ] Extract shared filter logic into `useFilterOptions` (already in `useFilters.ts`) and reuse it across search/explore once Explore is restored.
- [ ] Add small README-style docs in `src/components/context/` describing each context (Favorites, Offline, Location, Zoom) and how to use them.

### 4. Navigation & Routing
- [ ] Verify that all `DrawerItem` targets in `app/(drawer)/_layout.tsx` have matching screens (e.g. Beach, Dubrovnik City routes) or adjust navigation paths.
- [ ] Review hidden tab screens in `app/(drawer)/(tabs)/_layout.tsx` (e.g. `(screens)/popular`, `(screens)/sights`, etc.) and either implement them or remove the routes.
- [ ] Confirm `app/(drawer)/(listing)/[id].tsx` and `map.tsx` are fully wired to the new listing model; remove old commented `useFavorites` usage if obsolete.

### 5. UI & UX polish
- [ ] Centralize repeated card/grid layout styles (e.g. in `ResultCard`, `ResultCardZoom`, `CategoryCard`) to reduce duplication.
- [ ] Review theme usage (`theme.colors`, `tabGradient`, typography) to ensure all color tokens are either used or removed.
- [ ] Add loading/empty/"no results" messaging where lists can be empty (Search, future Explore, Favorites).
- [ ] Add accessibility improvements (accessibility labels for key buttons, especially in drawer and bottom tabs).

### 6. Offline & Performance
- [ ] Confirm `OfflineContext` behaviors and `OfflineBanner` behavior for slow/failed network; add unit tests or manual test checklist.
- [ ] Consider prefetching listings on app start (e.g. in Root layout or Home) to improve perceived performance.
- [ ] Audit image sizes/URLs used in `CategoryCard` and listing cards to ensure they are optimized for mobile.

### 7. DX & Maintenance
- [ ] Add basic project README with run/build instructions, environment variables (Firebase config, etc.), and high-level architecture.
- [ ] Add simple test for at least one core component or hook (e.g. `useListings` adapter behavior) using `react-test-renderer` or React Testing Library.
- [ ] Run a pass with TypeScript strictness and eslint/prettier (if you decide to add them) to catch unused imports and types.

### 8. Cleanup / Dead Code
- [ ] Search for and remove unused components, commented-out blocks, and old references to `useExperiences`, `useAvailableActivities`, and `useAvailableLocations` if you permanently switched to the new Firebase `listings` model.
- [ ] Remove any unused assets in `assets/images` that are no longer referenced in the app.

