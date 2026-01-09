# DCG-APP Components Inventory

**Purpose**: Track all components in `src/components/` - their locations, usage, and purpose.  
**Last Updated**: 2026-01-08

---

## **cards/** (6 components)

- **CategoryCard** (`cards/CategoryCard.tsx`)
  - **Purpose**: Category tiles with image, title badge, size variants
  - **Used in**: index.tsx (home page)
  - **Status**: ✅ Active - displays main category grid

- **CompactListingCard** (`cards/CompactListingCard.tsx`)
  - **Purpose**: Compact horizontal carousel card with overlay, badges (featured/popular/seasonal)
  - **Used in**: Via ListingCarousel
  - **Status**: ✅ Active - featured listings carousel

- **ListingCard** (`cards/ListingCard.tsx`)
  - **Purpose**: Full-width card with scrollable image gallery, category badges
  - **Used in**: Not directly imported (legacy?)
  - **Status**: ⚠️ May be unused - check for removal

- **ListingCarousel** (`cards/ListingCarousel.tsx`)
  - **Purpose**: Horizontal scrolling carousel wrapper for CompactListingCard
  - **Used in**: index.tsx, explore.tsx
  - **Status**: ✅ Active - featured content display

- **ResultCard** (`cards/ResultCard.tsx`)
  - **Purpose**: Standard list view card for search/explore results, includes heart button
  - **Used in**: favorites.tsx, explore.tsx, search.tsx
  - **Status**: ✅ Active - main result display (list mode)

- **ResultCardZoom** (`cards/ResultCardZoom.tsx`)
  - **Purpose**: Grid view variant with full-width image
  - **Used in**: favorites.tsx, explore.tsx, search.tsx
  - **Status**: ✅ Active - result display (grid mode)

---

## **context/** (4 providers)

- **FavoritesContext** (`context/FavoritesContext.tsx`)
  - **Purpose**: Global favorites state with AsyncStorage, provides `useFavorites()` hook
  - **Used in**: _layout.tsx (Provider), HeartButton, ResultCard, favorites.tsx
  - **Status**: ✅ Active - core feature

- **LocationContext** (`context/LocationContext.tsx`)
  - **Purpose**: Location permissions & user coordinates, provides `useLocation()` hook
  - **Used in**: _layout.tsx (Provider), search.tsx, explore.tsx, listing pages
  - **Status**: ✅ Active - "near me" filtering

- **OfflineContext** (`context/OfflineContext.tsx`)
  - **Purpose**: Network state & offline data caching, provides `useOffline()` hook
  - **Used in**: _layout.tsx (Provider), SettingsModal, OfflineBanner
  - **Status**: ✅ Active - offline mode support

- **ZoomContext** (`context/ZoomContext.tsx`)
  - **Purpose**: Card display mode (grid vs list), provides `useZoom()` hook
  - **Used in**: _layout.tsx (Provider), favorites.tsx, explore.tsx, search.tsx
  - **Status**: ✅ Active - view toggle feature

---

## **filters/** (1 component)

- **FilterHeader** (`filters/FilterHeader.tsx`)
  - **Purpose**: Segmented control filter with animated pill, chip selections
  - **Used in**: Not imported
  - **Status**: ⚠️ Legacy - consider removing if unused

---

## **maps/** (1 component)

- **StaticMap** (`maps/StaticMap.tsx`)
  - **Purpose**: Static Google Maps image with click-to-navigate, dark mode support
  - **Used in**: Listing detail page [id].tsx
  - **Status**: ✅ Active - shows listing location

---

## **modals/** (5 modals + settings subfolder)

- **CategoryPickerModal** (`modals/CategoryPickerModal.tsx`)
  - **Purpose**: Single-select category filter for favorites
  - **Used in**: favorites.tsx
  - **Status**: ✅ Active - favorites filtering

- **ExploreFilterModal** (`modals/ExploreFilterModal.tsx`)
  - **Purpose**: Bottom-sheet filter (categories, places, nearby, featured) for Explore
  - **Used in**: explore.tsx
  - **Status**: ✅ Active - explore page filtering

- **FilterByModal** (`modals/FilterByModal.tsx`)
  - **Purpose**: Animated filter modal (categories, near me, featured toggles)
  - **Used in**: Not imported
  - **Status**: ⚠️ Legacy - possible duplicate of ExploreFilterModal

- **ReportListingModal** (`modals/ReportListingModal.tsx`)
  - **Purpose**: Report form for listing issues, submits to Firebase 'reports' collection
  - **Used in**: [id].tsx (listing detail)
  - **Status**: ✅ Active - user reporting feature

- **SearchFilterModal** (`modals/SearchFilterModal.tsx`)
  - **Purpose**: Bottom-sheet filter (categories, places) for Search
  - **Used in**: search.tsx
  - **Status**: ✅ Active - search page filtering

### **modals/settings/** (8 files)

- **SectionHeader** (`modals/settings/SectionHeader.tsx`)
  - **Purpose**: Section title for settings groups
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **SettingButton** (`modals/settings/SettingButton.tsx`)
  - **Purpose**: Pressable settings row with icon, title, description, right text/chevron
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **SettingToggle** (`modals/settings/SettingToggle.tsx`)
  - **Purpose**: Settings row with toggle switch
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **SettingsModal** (`modals/settings/SettingsModal.tsx`)
  - **Purpose**: Main settings modal (theme, zoom, location, offline, admin)
  - **Used in**: _layout.tsx, explore.tsx, favorites.tsx
  - **Status**: ✅ Active - core settings

- **StatusBanner** (`modals/settings/StatusBanner.tsx`)
  - **Purpose**: Online/offline status indicator
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **ThemeSelector** (`modals/settings/ThemeSelector.tsx`)
  - **Purpose**: Three-button theme selector (system/light/dark)
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **ZoomSelector** (`modals/settings/ZoomSelector.tsx`)
  - **Purpose**: Two-button display mode selector (list/grid)
  - **Used in**: SettingsModal
  - **Status**: ✅ Active

- **index.ts** (`modals/settings/index.ts`)
  - **Purpose**: Barrel export for settings components
  - **Used in**: SettingsModal imports
  - **Status**: ✅ Active

---

## **system/** (1 component)

- **AppStatusBar** (`system/AppStatusBar.tsx`)
  - **Purpose**: Custom status bar with edge-to-edge Android support, theme awareness
  - **Used in**: _layout.tsx
  - **Status**: ✅ Active - system-level styling

---

## **ui/** (15 components)

- **Card** (`ui/Card.tsx`)
  - **Purpose**: Reusable card wrapper for listing detail sections
  - **Used in**: Listing pages (5+ sections)
  - **Status**: ✅ Active - detail page layout

- **Chip** (`ui/Chip.tsx`)
  - **Purpose**: Pressable chip/tag for filters
  - **Used in**: Not directly imported
  - **Status**: ⚠️ May be unused - check for removal

- **DetailsHeader** (`ui/DetailsHeader.tsx`)
  - **Purpose**: Animated header for listing detail (back, title, heart)
  - **Used in**: Not imported
  - **Status**: ⚠️ Replaced by UniversalHeader - consider removing

- **FeaturedCarousel** (`ui/FeaturedCarousel.tsx`)
  - **Purpose**: Horizontal scrolling carousel for featured content
  - **Used in**: explore.tsx
  - **Status**: ✅ Active - explore page carousel

- **HeartButton** (`ui/HeartButton.tsx`)
  - **Purpose**: Animated heart favorite toggle with bounce animation
  - **Used in**: ResultCard, UniversalHeader, listing pages
  - **Status**: ✅ Active - favorites feature

- **MiniMap** (`ui/MiniMap.tsx`)
  - **Purpose**: Interactive mini map with zoom controls (iOS MapView, Android static)
  - **Used in**: Not imported
  - **Status**: ⚠️ Legacy - StaticMap is used instead

- **OfflineBanner** (`ui/OfflineBanner.tsx`)
  - **Purpose**: Top banner showing offline status and cached count
  - **Used in**: index.tsx
  - **Status**: ✅ Active - offline mode indicator

- **SearchBar** (`ui/SearchBar.tsx`)
  - **Purpose**: Search input with icon and clear button
  - **Used in**: search.tsx
  - **Status**: ✅ Active - search functionality

- **SlowNetworkHint** (`ui/SlowNetworkHint.tsx`)
  - **Purpose**: Hint message during slow loading
  - **Used in**: favorites.tsx, explore.tsx, search.tsx
  - **Status**: ✅ Active - UX feedback

- **ThemeToggleButton** (`ui/ThemeToggleButton.tsx`)
  - **Purpose**: Compact button to toggle light/dark theme
  - **Used in**: Not directly imported
  - **Status**: ⚠️ May be integrated in UniversalHeader

- **Title** (`ui/Title.tsx`)
  - **Purpose**: Page title with optional subtitle and right accessory
  - **Used in**: index.tsx
  - **Status**: ✅ Active - page headers

- **TitleWithButton** (`ui/TitleWithButton.tsx`)
  - **Purpose**: Page title with menu/settings button
  - **Used in**: index.tsx
  - **Status**: ✅ Active - page headers with actions

- **ToolbarRow** (`ui/ToolbarRow.tsx`)
  - **Purpose**: Toolbar with result count, filter button, zoom toggle
  - **Used in**: favorites.tsx
  - **Status**: ✅ Active - favorites toolbar

- **TouchableHaptic** (`ui/TouchableHaptic.tsx`)
  - **Purpose**: Pressable wrapper with haptic feedback
  - **Used in**: 12+ files (modals, cards, listing pages)
  - **Status**: ✅ Active - core interaction component

- **UniversalHeader** (`ui/UniversalHeader.tsx`)
  - **Purpose**: Animated scroll header with gradient, navigation, theme toggle
  - **Used in**: [id].tsx, favorites.tsx, explore.tsx, search.tsx, all screens
  - **Status**: ✅ Active - main header component

---

## Summary

- **Total Components**: 41
- **Active**: 33 ✅
- **Potentially Unused**: 8 ⚠️

### Candidates for Phase 0+ Cleanup:
1. **ListingCard** - Not imported (legacy?)
2. **FilterHeader** - Not imported (legacy filter UI)
3. **FilterByModal** - Not imported (duplicate of ExploreFilterModal?)
4. **Chip** - Not imported (inline usage or legacy?)
5. **DetailsHeader** - Replaced by UniversalHeader
6. **MiniMap** - Replaced by StaticMap
7. **ThemeToggleButton** - May be integrated in UniversalHeader

**Next Steps**: Search codebase for dynamic imports or verify complete removal safety before deleting.
