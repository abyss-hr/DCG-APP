# DCG App Refactor Plan — Modernization Roadmap

**Created:** 2026-01-08  
**Goal:** Incrementally modernize the DCG app with performance improvements, better state management, and enhanced developer experience.

**Strategy:** Phased approach — each phase is independently deployable and adds value. Can pause/resume between phases.

---

## 🎯 Success Metrics

Before we start, let's define what "success" looks like:

- **Performance:** Scroll FPS stays at 60fps on mid-range Android devices
- **Load times:** Listing grid renders under 500ms (currently ~1-2s)
- **Memory:** Image memory usage drops by 40-50%
- **Developer experience:** Reduce boilerplate by ~60% (measured by lines of code in data fetching)
- **Bundle size:** Remove ~500KB of unused dependencies

---

## 📋 Pre-Migration Checklist

Before starting Phase 1:

- [ ] Ensure all current work is committed and pushed to `main`
- [ ] Create a new branch: `refactor/phase-1-performance`
- [ ] Document current performance baseline (use React DevTools Profiler)
- [ ] Take screenshots of key screens (for visual regression testing)
- [ ] Verify tests pass (if you have any)
- [ ] Backup: create git tag `pre-refactor-2026-01-08`

---

## Phase 0: Cleanup (1 day)

**Goal:** Remove unused dependencies and reduce bundle size.

**Risk:** Low (removing unused code)

### Steps

1. **Remove unused dependencies**
   ```bash
   npm uninstall react-native-dotenv react-native-swiper react-native-webview
   ```

2. **Update package-lock.json**
   ```bash
   npm install
   ```

3. **Test the build**
   ```bash
   npx expo start
   # Verify app still works
   ```

4. **Commit**
   ```bash
   git add package.json package-lock.json
   git commit -m "chore: remove unused dependencies (dotenv, swiper, webview)"
   ```

### Success Criteria
- [ ] App starts without errors
- [ ] All screens load correctly
- [ ] Bundle size reduced by ~500KB

### Rollback Plan
If something breaks: `git revert HEAD`

---

## Phase 1: Performance Wins (2-3 days)

**Goal:** Fix the 3 biggest performance bottlenecks (images, lists, caching).

**Risk:** Low-Medium (mostly drop-in replacements)

### Step 1.1: Install expo-image (Day 1, Morning)

1. **Install dependency**
   ```bash
   npx expo install expo-image
   ```

2. **Create a migration utility** (so we can track progress)
   - Create `src/utils/imageCompat.ts`:
     ```typescript
     // Re-export expo-image as Image
     // This allows gradual migration by importing from here
     export { Image } from 'expo-image';
     ```

3. **Migrate listing card images first** (highest impact)
   - Files to update:
     - `src/components/cards/ListingCard.tsx`
     - `src/components/cards/CompactListingCard.tsx`
     - `src/components/cards/ResultCard.tsx`
   
   - Find/replace in each file:
     ```tsx
     // Before
     import { Image } from 'react-native';
     
     // After
     import { Image } from 'expo-image';
     ```
   
   - Update Image usage (add contentFit):
     ```tsx
     // Before
     <Image source={{ uri }} style={styles.image} />
     
     // After
     <Image 
       source={{ uri }} 
       contentFit="cover" 
       style={styles.image}
       transition={200}
     />
     ```

4. **Test listing grids**
   - Open Explore screen
   - Scroll rapidly
   - Check for smooth loading (should see less flicker)

5. **Commit**
   ```bash
   git add .
   git commit -m "perf: migrate listing cards to expo-image"
   ```

### Step 1.2: Migrate listing detail images (Day 1, Afternoon)

1. **Update listing gallery**
   - Files:
     - `src/pages/listing/media/images/ListingGallery.tsx`
     - `src/pages/listing/media/images/ListingImageBadges.tsx`
   
   - Same pattern: replace imports + add `contentFit="cover"`

2. **Test listing detail pages**
   - Open any listing
   - Swipe through gallery
   - Check for smooth transitions

3. **Commit**
   ```bash
   git commit -am "perf: migrate listing detail images to expo-image"
   ```

### Step 1.3: Install FlashList (Day 2, Morning)

1. **Install dependency**
   ```bash
   npm install @shopify/flash-list
   ```

2. **Add peer dependencies (if needed)**
   ```bash
   npx expo install react-native-reanimated
   # (should already be installed)
   ```

3. **Migrate Explore screen first**
   - File: `app/(drawer)/(tabs)/explore.tsx`
   
   - Replace import:
     ```tsx
     // Before
     import { FlatList } from 'react-native';
     
     // After
     import { FlashList } from '@shopify/flash-list';
     ```
   
   - Update component:
     ```tsx
     // Before
     <FlatList
       data={listings}
       renderItem={renderItem}
       keyExtractor={(item) => item.id}
     />
     
     // After
     <FlashList
       data={listings}
       renderItem={renderItem}
       keyExtractor={(item) => item.id}
       estimatedItemSize={200}  // Add this (approx card height)
     />
     ```

4. **Test scrolling**
   - Open Explore
   - Scroll fast
   - Should see no blank cells during scroll

5. **Commit**
   ```bash
   git commit -am "perf: migrate Explore screen to FlashList"
   ```

### Step 1.4: Migrate other lists (Day 2, Afternoon)

1. **Migrate Search results**
   - File: `app/(drawer)/(tabs)/search.tsx`
   - Same pattern as Explore

2. **Migrate category screens**
   - Files:
     - `app/(drawer)/(tabs)/(screens)/sights.tsx`
     - `app/(drawer)/(tabs)/(screens)/food-and-drink.tsx`
     - Any other list screens
   
3. **Test each screen**

4. **Commit**
   ```bash
   git commit -am "perf: migrate remaining list screens to FlashList"
   ```

### Step 1.5: Measure improvements (Day 3, Morning)

1. **Use React DevTools Profiler**
   - Record Explore screen scroll before/after
   - Compare render times

2. **Document results**
   - Add to CHANGELOG_NOTES.md:
     ```
     ## 2026-01-XX — Claude Sonnet 4.5
     Phase 1 complete: Performance improvements
     - Migrated to expo-image (50% faster image loads)
     - Migrated to FlashList (10x faster list rendering)
     - Measured: [add your metrics here]
     ```

### Phase 1 Success Criteria
- [ ] All images use `expo-image`
- [ ] All lists use `FlashList`
- [ ] No visual regressions
- [ ] Scrolling is noticeably smoother
- [ ] App builds and runs on iOS + Android

### Phase 1 Rollback Plan
If major issues: 
```bash
git checkout main
git branch -D refactor/phase-1-performance
```

---

## Phase 2: State Management (3-5 days)

**Goal:** Add React Query for server state and Zustand for client state.

**Risk:** Medium (requires refactoring Context logic)

### Step 2.1: Install React Query (Day 1, Morning)

1. **Install dependencies**
   ```bash
   npm install @tanstack/react-query
   ```

2. **Set up QueryClient**
   - Create `src/lib/queryClient.ts`:
     ```typescript
     import { QueryClient } from '@tanstack/react-query';
     
     export const queryClient = new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 1000 * 60 * 5, // 5 minutes
           cacheTime: 1000 * 60 * 30, // 30 minutes
           retry: 2,
         },
       },
     });
     ```

3. **Wrap app in QueryClientProvider**
   - File: `app/_layout.tsx`
   - Add:
     ```tsx
     import { QueryClientProvider } from '@tanstack/react-query';
     import { queryClient } from '@/lib/queryClient';
     
     // In your root layout:
     <QueryClientProvider client={queryClient}>
       {/* existing app tree */}
     </QueryClientProvider>
     ```

4. **Test app still works**

5. **Commit**
   ```bash
   git commit -am "feat: add React Query setup"
   ```

### Step 2.2: Create listing query hooks (Day 1, Afternoon)

1. **Create hook file**
   - File: `src/hooks/useListingsQuery.ts`
   - Basic structure:
     ```typescript
     import { useQuery } from '@tanstack/react-query';
     import { getListings } from '@/database/listingService';
     
     export function useListingsQuery(category?: string) {
       return useQuery({
         queryKey: ['listings', category],
         queryFn: () => getListings({ category }),
       });
     }
     ```

2. **Don't migrate screens yet** — just create the hooks

3. **Test with one screen** (Explore)
   - Replace old fetch logic with:
     ```tsx
     const { data: listings = [], isLoading } = useListingsQuery();
     ```

4. **Commit**
   ```bash
   git commit -am "feat: add useListingsQuery hook"
   ```

### Step 2.3: Migrate all screens to React Query (Day 2-3)

1. **Migrate screens one by one**
   - Order of priority:
     1. Explore (most impactful)
     2. Search
     3. Category screens (Sights, Food, Beach, etc.)
     4. Favorites (if fetching from server)

2. **For each screen:**
   - Remove manual `useState` + `useEffect` fetch logic
   - Replace with `useListingsQuery` hook
   - Remove loading states (React Query provides `isLoading`)
   - Remove error handling (React Query provides `error`)

3. **Example migration:**
   ```tsx
   // Before (manual fetch)
   const [listings, setListings] = useState([]);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     async function fetch() {
       setLoading(true);
       const data = await getListings();
       setListings(data);
       setLoading(false);
     }
     fetch();
   }, []);
   
   // After (React Query)
   const { data: listings = [], isLoading } = useListingsQuery();
   ```

4. **Test each screen** after migration

5. **Commit after each screen**
   ```bash
   git commit -am "refactor: migrate [ScreenName] to React Query"
   ```

### Step 2.4: Install Zustand (Day 4, Morning)

1. **Install**
   ```bash
   npm install zustand
   ```

2. **Create filter store**
   - File: `src/store/filterStore.ts`
   - Basic structure:
     ```typescript
     import { create } from 'zustand';
     
     interface FilterState {
       category: string | null;
       priceRange: [number, number] | null;
       setCategory: (cat: string | null) => void;
       setPriceRange: (range: [number, number] | null) => void;
       clearFilters: () => void;
     }
     
     export const useFilterStore = create<FilterState>((set) => ({
       category: null,
       priceRange: null,
       setCategory: (category) => set({ category }),
       setPriceRange: (priceRange) => set({ priceRange }),
       clearFilters: () => set({ category: null, priceRange: null }),
     }));
     ```

3. **Test store**
   - Use in one component:
     ```tsx
     const category = useFilterStore((s) => s.category);
     const setCategory = useFilterStore((s) => s.setCategory);
     ```

4. **Commit**
   ```bash
   git commit -am "feat: add Zustand filter store"
   ```

### Step 2.5: Migrate Context to Zustand (Day 4-5)

1. **Identify Contexts to migrate:**
   - FilterContext → `filterStore.ts`
   - FavoritesContext → `favoritesStore.ts`
   - ZoomContext → `zoomStore.ts`

2. **For each Context:**
   - Create Zustand store
   - Replace `useContext` calls with Zustand hooks
   - Remove Context Provider from app tree
   - Delete old Context file

3. **Example migration:**
   ```tsx
   // Before (Context)
   const { favorites, addFavorite } = useFavorites();
   
   // After (Zustand)
   const favorites = useFavoritesStore((s) => s.favorites);
   const addFavorite = useFavoritesStore((s) => s.addFavorite);
   ```

4. **Keep ThemeContext** (for now) — it's working fine

5. **Commit after each store**
   ```bash
   git commit -am "refactor: migrate [Context] to Zustand"
   ```

### Phase 2 Success Criteria
- [ ] React Query is installed and configured
- [ ] All listing fetches use React Query
- [ ] Filter/Favorites/Zoom use Zustand
- [ ] Context Providers removed (except Theme)
- [ ] App feels faster (instant cache hits on back navigation)

### Phase 2 Rollback Plan
React Query can coexist with old code, so rollback is per-screen:
```bash
git revert <commit-hash-of-specific-screen>
```

---

## Phase 3: Styling System (1-2 weeks, optional)

**Goal:** Add NativeWind for faster UI development and consistent theming.

**Risk:** High (large refactor, touches every component)

**Recommendation:** Only do this if you plan significant UI work. Otherwise, skip.

### Step 3.1: Install NativeWind (Day 1)

1. **Install dependencies**
   ```bash
   npm install nativewind
   npm install --save-dev tailwindcss
   ```

2. **Initialize Tailwind**
   ```bash
   npx tailwindcss init
   ```

3. **Configure tailwind.config.js**
   ```javascript
   module.exports = {
     content: [
       './app/**/*.{js,jsx,ts,tsx}',
       './src/**/*.{js,jsx,ts,tsx}',
     ],
     theme: {
       extend: {
         colors: {
           background: 'var(--color-background)',
           primary: 'var(--color-primary)',
           // ... map your theme tokens
         },
       },
     },
   };
   ```

4. **Set up babel plugin**
   - Update `babel.config.js`:
     ```javascript
     plugins: [
       // ... existing plugins
       'nativewind/babel',
     ],
     ```

5. **Create global.css**
   - File: `src/styles/global.css`
   - Define theme variables

6. **Test with one component**
   - Convert a simple button to use `className` instead of `style`

7. **Commit**
   ```bash
   git commit -am "feat: add NativeWind setup"
   ```

### Step 3.2: Migrate components gradually (Days 2-10)

**Strategy:** Migrate one component folder at a time (slowest to fastest impact):

1. **Week 1: UI primitives**
   - `src/components/ui/` (buttons, inputs, cards)
   - These are used everywhere, so migrating them has high impact

2. **Week 2: Feature components**
   - `src/components/cards/` (listing cards)
   - `src/components/modals/`
   - `src/pages/listing/`

3. **For each component:**
   - Replace `StyleSheet.create` with `className` strings
   - Remove `style` objects
   - Test visually (compare screenshots)

4. **Commit frequently**
   ```bash
   git commit -am "refactor: migrate [ComponentName] to NativeWind"
   ```

### Step 3.3: Clean up old theme (Day 11)

1. **Consolidate theme tokens** in `tailwind.config.js`
2. **Remove manual theme utils** (if no longer needed)
3. **Document new pattern** in README

### Phase 3 Success Criteria
- [ ] All components use NativeWind `className`
- [ ] Theme switching still works
- [ ] No visual regressions
- [ ] Developer velocity is faster (measured by time to build new UI)

### Phase 3 Rollback Plan
This is a big refactor. If you need to rollback:
```bash
git checkout main
git branch -D refactor/phase-3-styling
```

---

## Phase 4: Forms & Polish (1 week, optional)

**Goal:** Add form validation and final enhancements.

**Risk:** Low (isolated to forms)

### Step 4.1: Install form libraries (Day 1)

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Step 4.2: Migrate forms (Days 2-4)

1. **Report Listing Modal**
   - File: `src/components/modals/ReportListingModal.tsx`
   - Add Zod schema for validation
   - Use `react-hook-form` for form state

2. **Admin forms** (if applicable)

3. **Search/Filter forms** (if complex validation needed)

### Step 4.3: Add expo-blur (Day 5, optional)

1. **Install**
   ```bash
   npx expo install expo-blur
   ```

2. **Add to modals** (nice-to-have visual polish)

### Phase 4 Success Criteria
- [ ] Forms have proper validation
- [ ] Better error messages
- [ ] Optional: blur backdrops enhance modal UX

---

## 📊 Progress Tracking

Use this checklist to track overall progress:

- [ ] **Phase 0: Cleanup** (1 day)
  - [ ] Remove unused dependencies
  - [ ] Test build

- [ ] **Phase 1: Performance** (2-3 days)
  - [ ] expo-image in listing cards
  - [ ] expo-image in listing detail
  - [ ] FlashList in Explore
  - [ ] FlashList in other screens
  - [ ] Measure improvements

- [ ] **Phase 2: State Management** (3-5 days)
  - [ ] Install React Query
  - [ ] Create listing query hooks
  - [ ] Migrate screens to React Query
  - [ ] Install Zustand
  - [ ] Migrate Contexts to Zustand

- [ ] **Phase 3: Styling** (1-2 weeks, optional)
  - [ ] Install NativeWind
  - [ ] Migrate UI primitives
  - [ ] Migrate feature components
  - [ ] Clean up old theme

- [ ] **Phase 4: Forms & Polish** (1 week, optional)
  - [ ] Install form libraries
  - [ ] Migrate forms
  - [ ] Add expo-blur

---

## 🚦 Decision Points

After each phase, decide whether to continue:

### After Phase 1 (Performance)
**Ask:** Did performance improve noticeably?
- **Yes** → Continue to Phase 2
- **No** → Debug Phase 1 before proceeding

### After Phase 2 (State Management)
**Ask:** Is the codebase cleaner? Do you feel productive?
- **Yes** → Optionally continue to Phase 3
- **No** → Pause and use app for a week, then reassess

### After Phase 2 (Alternative)
**Ask:** Do you plan significant UI changes soon?
- **Yes** → Do Phase 3 (NativeWind)
- **No** → Skip Phase 3, jump to Phase 4 (or stop)

---

## 🔄 Branch Strategy

**Recommended approach:**

1. **Phase 1:** Work on `refactor/phase-1-performance`
   - Merge to `main` when complete
   - Tag: `v1.1-performance`

2. **Phase 2:** Work on `refactor/phase-2-state`
   - Merge to `main` when complete
   - Tag: `v1.2-state`

3. **Phase 3 (if doing):** Work on `refactor/phase-3-styling`
   - Merge to `main` when complete
   - Tag: `v1.3-styling`

**Why separate branches?** 
- Each phase is independently deployable
- Can pause between phases without blocking other work
- Easy to rollback one phase without affecting others

---

## 📝 Documentation Updates

After each phase, update these files:

1. **CHANGELOG_NOTES.md** — Record what changed, when, and by whom
2. **DEPENDENCIES_NOTES.md** — Update with new dependencies added
3. **README.md** (if you have one) — Update setup instructions if needed

---

## ⏱️ Estimated Timeline

**Minimum (Phases 0-1):** ~4 days
- Cleanup + performance wins only
- Immediate user-facing improvements

**Recommended (Phases 0-2):** ~9 days (less than 2 weeks)
- Cleanup + performance + state management
- Best balance of effort/reward

**Full refactor (Phases 0-4):** ~4-5 weeks
- Complete modernization
- Best for long-term maintainability

---

## 🎯 When to Stop

You don't have to complete all phases. Good stopping points:

1. **After Phase 1** — if you just want performance fixes
2. **After Phase 2** — if you're happy with cleaner state management
3. **Skip Phase 3** — if current styling approach works fine
4. **Skip Phase 4** — if you don't have complex forms

---

## ❓ FAQ

**Q: Can I do phases in a different order?**  
A: Phase 1 and 2 are independent. But do Phase 0 first, and Phase 3 after Phase 2.

**Q: What if I encounter a blocker?**  
A: Commit your progress, create a GitHub issue documenting the blocker, and pause. Resume when unblocked.

**Q: Can I skip a phase?**  
A: Yes. Phases 3 and 4 are optional. Phase 1 and 2 are highly recommended.

**Q: Will this break my app?**  
A: Each phase is tested incrementally. Risk is low if you commit frequently and test after each step.

**Q: How do I know if I'm done with a phase?**  
A: Check the "Success Criteria" section for each phase. All checkboxes should be ticked.

---

## 📞 Next Steps

1. **Review this plan** with your team (if applicable)
2. **Decide which phases** you want to tackle
3. **Schedule time** (block out calendar for focused work)
4. **Create backup tag:**
   ```bash
   git tag pre-refactor-2026-01-08
   git push origin pre-refactor-2026-01-08
   ```
5. **Start with Phase 0** (cleanup, ~1 day)

When you're ready to begin, just say: "Let's start Phase 0" or "Let's start Phase 1" and I'll guide you through each step.

---

**Good luck!** 🚀
