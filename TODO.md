# DCG-APP TODO List

**Last Updated**: 2026-01-09

---

## 🔄 In Progress

### Phase 2: State Management
- [ ] Install and configure React Query (@tanstack/react-query)
- [ ] Install Zustand for global state
- [ ] Replace Firebase hooks with React Query
- [ ] Migrate context providers to Zustand (optional)

---

## 📋 Pending Tasks

### Extended Phase 0 Cleanup (Component Removal)
**Priority**: Medium  
**Estimated Impact**: ~500-1000 lines removed

Components to verify and remove (from SRC-COMPONENTS.md):
1. [ ] **ListingCard** (`cards/ListingCard.tsx`) - Not imported, verify no dynamic usage
2. [ ] **FilterHeader** (`filters/FilterHeader.tsx`) - Legacy filter UI
3. [ ] **FilterByModal** (`modals/FilterByModal.tsx`) - Possible duplicate of ExploreFilterModal
4. [ ] **Chip** (`ui/Chip.tsx`) - Not directly imported, check inline usage
5. [ ] **DetailsHeader** (`ui/DetailsHeader.tsx`) - Replaced by UniversalHeader
6. [ ] **MiniMap** (`ui/MiniMap.tsx`) - Replaced by StaticMap
7. [ ] **ThemeToggleButton** (`ui/ThemeToggleButton.tsx`) - May be integrated in UniversalHeader

**Action Items**:
- Search for dynamic imports: `require()`, template literals in imports
- Verify no string-based component references
- Test app after each removal
- Update SRC-COMPONENTS.md after cleanup

---

## 🚀 Future Phases

### Phase 2: State Management
- [ ] Install and configure React Query (@tanstack/react-query)
- [ ] Install Zustand for global state
- [ ] Replace Firebase hooks with React Query
- [ ] Migrate context providers to Zustand (optional)

### Phase 3: Styling & Polish
- [ ] Consider NativeWind (Tailwind for React Native) - optional
- [ ] Audit and optimize theme system
- [ ] Review and standardize spacing/typography

---

## 📝 Documentation Tasks
- [ ] Keep CHANGELOG_NOTES.md updated with each phase
- [ ] Update SRC-COMPONENTS.md after component removals
- [ ] Document any breaking changes or migration notes

---

## ✅ Completed
- [x] **Phase 1: Performance Improvements** (2026-01-09)
  - Installed expo-image and @shopify/flash-list
  - Replaced Image with expo-image in CategoryCard and MiniMap
  - Replaced FlatList with FlashList in search.tsx
  - Configured estimatedItemSize for optimal performance
  - Created SRC-COMPONENTS.md and TODO.md documentation
- [x] **Phase 0: Cleanup** - Removed admin panel, unused files, unused dependencies (2026-01-08)
- [x] Created backup strategy (tag + feature branch)
- [x] Security audit - moved secrets to .env
- [x] Created documentation files (CHANGELOG, DEPENDENCIES, REFACTOR_PLAN, ADMIN, SRC-COMPONENTS)
