# Dependency Comparison: Current DCG vs Recommended Stack

**Date:** 2026-01-07  
**Purpose:** Compare current DCG app dependencies with the recommended stack from expo-playground reference to identify improvements for design, performance, and UX.

**Note:** This is analysis only — no code changes made.

---

## Summary Assessment

### ✅ What you're doing well
- Good icon library choice (`lucide-react-native`)
- Firebase already integrated
- Animation primitives in place (`react-native-reanimated`)
- Haptics + Linear gradients for polish
- Offline/network handling (`@react-native-community/netinfo`)

### ⚠️ What could be improved
- **No styling system** (manual StyleSheet vs NativeWind/Tailwind)
- **No server state management** (manual data fetching vs React Query)
- **No client state management** (Context API everywhere vs Zustand)
- **No optimized list rendering** (FlatList vs FlashList)
- **No optimized images** (Image vs expo-image)
- **No form validation library** (manual validation vs react-hook-form + zod)

### 🗑️ Unused dependencies to remove
- `react-native-dotenv` (not used; using `dotenv` instead)
- `react-native-swiper` (not found in code)
- `react-native-webview` (not found in code)

---

## Side-by-Side Comparison

| Category | DCG App (Current) | Recommended Stack | Assessment |
|----------|-------------------|-------------------|------------|
| **Styling** | Manual `StyleSheet` API | `nativewind` + `tailwindcss` | ⚠️ **Missing**: NativeWind would speed up UI development, ensure consistency, and make theme switching cleaner. |
| **Icons** | `@expo/vector-icons` (Feather/Ionicons) + `lucide-react-native` | `lucide-react-native` only | ✅ **Good**: You have Lucide. Consider standardizing on one library (remove @expo/vector-icons or keep both if needed for legacy). |
| **Images** | React Native `<Image>` | `expo-image` | ⚠️ **Missing**: `expo-image` has better caching, blurhash placeholders, faster decoding, and lower memory. **High priority for listings with many images.** |
| **Lists** | `FlatList` | `@shopify/flash-list` | ⚠️ **Missing**: FlashList renders 10x faster on long lists. **High priority for Explore/Search screens.** |
| **Animations** | `react-native-reanimated` ✅ | `react-native-reanimated` | ✅ **Good**: Already installed. |
| **Carousels** | `react-native-reanimated-carousel` | (not specified, but reanimated-carousel is solid) | ✅ **Good**: Modern carousel choice. |
| **Server State** | Manual fetch + Context | `@tanstack/react-query` | ⚠️ **Missing**: React Query handles caching, pagination, retries, refetching, and stale-while-revalidate automatically. Would reduce boilerplate and improve UX. **High priority.** |
| **Client State** | React Context API | `zustand` | ⚠️ **Missing**: Zustand is lighter, faster, and simpler than Context for filters/favorites/preferences. **Medium priority.** |
| **Forms & Validation** | Manual validation | `react-hook-form` + `zod` | ⚠️ **Missing**: Would simplify admin forms, report listing modal, search filters validation. **Low priority unless adding complex forms.** |
| **Storage** | `@react-native-async-storage/async-storage` | (same) | ✅ **Good**: Standard choice. |
| **Navigation** | `@react-navigation/drawer` + `@react-navigation/native` | (same, with Expo Router) | ✅ **Good**: Standard. |
| **Networking** | `@react-native-community/netinfo` | (not specified, but good to have) | ✅ **Good**: Your offline/slow network handling is a plus. |
| **Firebase** | `firebase` | `firebase` | ✅ **Good**: Already integrated. |
| **Distance Calc** | `haversine-distance` | (not specified) | ✅ **Good**: Lightweight utility for location features. |
| **YouTube** | `react-native-youtube-iframe` | (not specified) | ✅ **Good**: If you need video embeds, this is the standard choice. |
| **Haptics** | `expo-haptics` | `expo-haptics` | ✅ **Good**: Already using. |
| **Blur** | (not installed) | `expo-blur` | ⚠️ **Missing**: Would enhance modals, overlays, and iOS-style backdrops. **Low priority, nice-to-have.** |
| **Linear Gradient** | `expo-linear-gradient` | `expo-linear-gradient` | ✅ **Good**: Already using. |
| **Env Loading** | `dotenv` | (same pattern) | ✅ **Good**: Works well with app.config.js. |
| **Module Aliases** | `babel-plugin-module-resolver` (`@/...`) | (not specified, but recommended) | ✅ **Good**: Clean imports. |
| **Worklets** | `react-native-worklets` | (not specified, but needed for some animations) | ✅ **Good**: Supports reanimated worklets. |

---

## Detailed Recommendations

### 🔥 High Priority (performance + UX impact)

#### 1. Add `expo-image` (replaces React Native Image)
**Why:**
- 50-70% faster image loading
- Blurhash placeholders (smooth loading experience)
- Better memory management (critical for listing grids with 100+ images)
- Automatic disk caching

**Where it helps:**
- Listing cards (grid/list views)
- Listing detail hero/gallery
- Category cards
- Any thumbnail

**Migration:**
```tsx
// Before
import { Image } from 'react-native';
<Image source={{ uri }} style={...} />

// After
import { Image } from 'expo-image';
<Image source={{ uri }} placeholder={blurhash} contentFit="cover" style={...} />
```

#### 2. Add `@shopify/flash-list` (replaces FlatList)
**Why:**
- 10x faster rendering on long lists
- Eliminates blank cells during fast scrolling
- Lower memory usage
- Drop-in replacement for FlatList

**Where it helps:**
- Explore screen (all listings)
- Search results
- Category listings (Sights, Food & Drink, Beach, etc.)

**Migration:**
```tsx
// Before
import { FlatList } from 'react-native';
<FlatList data={listings} renderItem={...} />

// After
import { FlashList } from '@shopify/flash-list';
<FlashList data={listings} renderItem={...} estimatedItemSize={200} />
```

#### 3. Add `@tanstack/react-query` (server state management)
**Why:**
- Automatic caching (users see instant results on back navigation)
- Background refetching (data stays fresh)
- Pagination/infinite scroll built-in
- Retry logic
- Loading/error states out of the box
- Eliminates 80% of your custom fetch + useEffect + Context code

**Where it helps:**
- Listing fetches (categories, search, nearby)
- Firebase Firestore queries
- Offline-first sync (pairs well with your NetInfo logic)

**Example:**
```tsx
// Before: manual fetch + Context + useEffect boilerplate
const [listings, setListings] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => { /* fetch logic */ }, []);

// After: one hook
const { data: listings, isLoading } = useListings({ category: 'sights' });
```

---

### 🟡 Medium Priority (developer experience + maintainability)

#### 4. Add `zustand` (client state management)
**Why:**
- Simpler than Context API for global state
- No Provider hell
- Better performance (granular subscriptions)
- 1KB gzipped

**Where it helps:**
- Filter state (categories, price, rating)
- Favorites (could replace AsyncStorage + Context)
- Theme preferences (could replace your ThemeProvider Context)
- Zoom level state

**Example:**
```tsx
// Before: Context + Provider + useContext
const FilterContext = createContext(...);
export const FilterProvider = ({ children }) => { /* boilerplate */ };

// After: one file
import { create } from 'zustand';
export const useFilterStore = create((set) => ({
  category: null,
  setCategory: (cat) => set({ category: cat }),
}));
```

#### 5. Add `nativewind` (Tailwind CSS for React Native)
**Why:**
- Faster UI development (no StyleSheet objects)
- Consistent spacing/colors via theme tokens
- Dark mode via `dark:` classes
- Responsive design via breakpoints

**Where it helps:**
- Listing cards
- Buttons, inputs
- Layout spacing
- Theme switching

**Example:**
```tsx
// Before
<View style={{ padding: 16, backgroundColor: theme.background }}>

// After
<View className="p-4 bg-background dark:bg-dark-background">
```

**Note:** Migration is bigger (requires config), so do this when you have time for a refactor sprint.

---

### 🟢 Low Priority (nice-to-have)

#### 6. Add `expo-blur`
**Why:**
- iOS-style blur backdrops for modals/overlays
- Better visual hierarchy

**Where it helps:**
- Filter modals
- Settings modal backdrop
- Image gallery overlay

#### 7. Add `react-hook-form` + `zod`
**Why:**
- Simplifies form validation (admin, report listing, search filters)
- Type-safe validation

**Where it helps:**
- Report listing modal
- Admin forms (if you build a CMS)
- Search/filter forms with validation rules

**Note:** Only add if you plan complex forms. For simple inputs, manual validation is fine.

---

## Performance Bottlenecks You Can Fix Now

Based on your current stack:

1. **Listing grids with many images**
   - Problem: React Native `<Image>` loads slowly, uses lots of memory
   - Fix: Replace with `expo-image`

2. **Scrolling through 100+ listings**
   - Problem: `FlatList` renders blank cells during fast scroll
   - Fix: Replace with `@shopify/flash-list`

3. **Repeated Firebase fetches on screen revisit**
   - Problem: Manual fetching + no cache = slow UX + wasted bandwidth
   - Fix: Add `@tanstack/react-query`

4. **Context re-renders**
   - Problem: Filter/theme Context causes re-renders of unrelated components
   - Fix: Switch to `zustand` for granular updates

---

## Migration Strategy (if you decide to adopt recommended stack)

### Phase 1: Performance wins (2-3 days)
1. Install `expo-image` → replace `<Image>` in listing cards/gallery
2. Install `@shopify/flash-list` → replace `<FlatList>` in Explore/Search
3. Measure: check frame drops in dev tools (should see smoother scroll)

### Phase 2: State management (3-5 days)
1. Install `@tanstack/react-query` → wrap app in QueryClientProvider
2. Migrate listing fetches to `useQuery` hooks
3. Remove manual fetch logic + Context boilerplate
4. Install `zustand` → migrate filter/favorites state

### Phase 3: Styling refactor (1-2 weeks, optional)
1. Install `nativewind` + configure Tailwind
2. Migrate StyleSheet objects to className (can do gradually, file by file)
3. Consolidate theme tokens

### Phase 4: Forms (if needed)
1. Install `react-hook-form` + `zod`
2. Migrate report modal, admin forms

---

## Unused Dependencies to Remove

These are installed but not found in your codebase:

```bash
npm uninstall react-native-dotenv react-native-swiper react-native-webview
```

**Estimated savings:** ~500KB bundle size

---

## Final Verdict

### Keep (don't change)
- `lucide-react-native` (modern, tree-shakeable icons)
- `firebase` (your backend)
- `react-native-reanimated` (animation primitives)
- `haversine-distance` (lightweight distance calc)
- `react-native-youtube-iframe` (if you use videos)
- `@react-native-community/netinfo` (offline handling)

### Add (high ROI)
1. `expo-image` — **biggest performance win for image-heavy app**
2. `@shopify/flash-list` — **solves scrolling performance**
3. `@tanstack/react-query` — **eliminates 80% of state boilerplate + improves UX**

### Consider (medium ROI)
4. `zustand` — cleaner state than Context
5. `nativewind` — faster UI development (but requires refactor)

### Skip for now
- `react-hook-form` + `zod` — only if you add complex forms
- `expo-blur` — nice visual polish, but not critical

---

## Questions for You

1. **How many listings do you have?** (If 50+, FlashList is critical. If 500+, expo-image + React Query are critical.)
2. **Do users report slow scrolling?** (If yes, prioritize FlashList.)
3. **Do you plan to add more forms/filters?** (If yes, consider react-hook-form + zod.)
4. **Is offline mode important?** (You already have NetInfo — React Query would pair well for offline-first caching.)
5. **Do you want to do a styling refactor?** (If yes, NativeWind. If no, keep current StyleSheet approach.)

---

## Next Steps

1. Review this comparison.
2. Decide which dependencies align with your goals (performance? developer speed? offline UX?).
3. If you want to proceed with any additions, we can:
   - Install + configure one at a time (safest)
   - Create a separate test branch to experiment
   - Migrate piece by piece (e.g., start with expo-image in one screen, measure improvement, then expand)

No code changes made yet — this is just the comparison/roadmap.
