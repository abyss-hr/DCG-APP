# TODO: [id].tsx Page Rebuild - Step by Step

## 🎯 GOALS

1. **Unified Header System** - Consistent across all pages
2. **Component-Based Architecture** - Easy to maintain
3. **Better UI** - Cards, badges, proper spacing
4. **New Features** - Share modal, favorites/save
5. **Performance** - Lazy loading, optimized rendering

---

## 📋 PHASE 1: HEADER SYSTEM

### 1.1 Create Two Header Types

**A) PageHeader** (for list pages: Search, Explore, Popular, etc.)
```
[← Back]  [Page Title]  [Settings] [Menu Toggle]
```
- Used on: search.tsx, explore.tsx, favorites.tsx
- Left: Back button (chevron-left)
- Center: Page title
- Right: Settings icon + Menu toggle (hamburger)

**B) DetailHeader** (for [id].tsx page only)
```
[← Back]  [Listing Title]  [Share] [❤️ Save]
```
- Used on: [id].tsx
- Left: Back button (arrow-left)
- Center: Listing title (scrolls with content)
- Right: Share icon + Heart icon (saved/unsaved)

### Files to Create:
- `src/components/ui/PageHeader.tsx` - Standard page header
- `src/components/ui/DetailHeader.tsx` - Listing detail header

### Files to Update:
- `app/(drawer)/(tabs)/search.tsx` - Use PageHeader
- `app/(drawer)/(tabs)/explore.tsx` - Use PageHeader
- `app/(drawer)/(tabs)/favorites.tsx` - Use PageHeader
- `app/(drawer)/(listing)/[id].tsx` - Use DetailHeader

---

## 📋 PHASE 2: IMAGE GALLERY COMPONENT

### 2.1 Create ImageGalleryCard Component

**Layout:**
```
┌─────────────────────────────┐
│ [🏆] [$$$]    Top-Left       │  ← Featured/Popular + Price badges (bubbles)
│                              │
│        Image Swiper          │
│                              │
│               [Seasonal]     │  ← Top-Right seasonal badge (if applicable)
│                              │
│                     [• • •]  │  ← Bottom-Right dots indicator
└─────────────────────────────┘
```

**Features:**
- Swiper with smooth transitions
- Custom pagination dots (bottom-right)
- Badge bubbles (top-left) for featured/popular + price level
- Seasonal badge (top-right) if `workingPeriod` contains seasonal info
- Fallback placeholder if no images

**Props:**
```typescript
{
  images: string[];
  featured?: boolean;
  popular?: boolean;
  priceLevel?: string;
  workingPeriod?: string;
}
```

### Files to Create:
- `src/components/cards/ImageGalleryCard.tsx`
- `src/components/cards/BadgeBubble.tsx` (reusable bubble badge)

---

## 📋 PHASE 3: LISTING DETAIL CARDS

### 3.1 Break Down into Card Components

Each section becomes a separate component:

**A) TitleCard** - Title, location, category, description
```tsx
// src/components/cards/listing/TitleCard.tsx
<TitleCard 
  title={listing.title}
  location={listing.locationMain}
  locationSub={listing.locationSub}
  category={listing.categoryName}
  description={listing.description}
  descriptionFeatured={listing.descriptionFeatured}
  featured={listing.featured}
  filterMain={listing.filterMain}
  filterExtra={listing.filterExtra}
/>
```

**B) InfoCard** - Details grid (price, hours, added date)
```tsx
// src/components/cards/listing/InfoCard.tsx
<InfoCard 
  priceLevel={listing.priceLevel}
  workingPeriod={listing.workingPeriod}
  createdAt={listing.createdAt}
/>
```

**C) VideoCard** - YouTube video section
```tsx
// src/components/cards/listing/VideoCard.tsx
<VideoCard youtubeUrl={listing.youtubeUrl} />
```

**D) MapCard** - Map with navigation buttons
```tsx
// src/components/cards/listing/MapCard.tsx
<MapCard 
  latitude={latitude}
  longitude={longitude}
  title={listing.title}
  googleMapUrl={listing.googleMapUrl}
/>
```

**E) SocialCard** - Website, Facebook, Instagram
```tsx
// src/components/cards/listing/SocialCard.tsx
<SocialCard 
  website={listing.website}
  facebook={listing.facebook}
  instagram={listing.instagram}
/>
```

**F) ContactBar** - Fixed bottom bar
```tsx
// src/components/ui/ContactBar.tsx
<ContactBar 
  phone={listing.phone}
  whatsapp={listing.whatsapp}
  email={listing.email}
/>
```

### Files to Create:
- `src/components/cards/listing/TitleCard.tsx`
- `src/components/cards/listing/InfoCard.tsx`
- `src/components/cards/listing/VideoCard.tsx`
- `src/components/cards/listing/MapCard.tsx`
- `src/components/cards/listing/SocialCard.tsx`
- `src/components/ui/ContactBar.tsx`

---

## 📋 PHASE 4: SHARE & SAVE FEATURES

### 4.1 Share Modal

**ShareModal Component:**
- Modal that overlays entire screen
- Options: Copy Link, WhatsApp, Facebook, Email, More...
- Haptic feedback on actions
- Close on backdrop tap

```tsx
// src/components/modals/ShareModal.tsx
<ShareModal 
  visible={shareVisible}
  onClose={() => setShareVisible(false)}
  title={listing.title}
  url={shareUrl}
/>
```

### 4.2 Favorites System

**Favorites Hook:**
```tsx
// src/hooks/useFavorites.ts
const { isFavorite, toggleFavorite } = useFavorites(listing.id);
```

**Features:**
- Save to AsyncStorage
- Heart icon in header (filled/unfilled)
- Haptic feedback on toggle
- Sync with favorites page

### Files to Create:
- `src/components/modals/ShareModal.tsx`
- `src/hooks/useFavorites.ts`
- `src/utils/favoriteStorage.ts`

---

## 📋 PHASE 5: FINAL [id].tsx STRUCTURE

### Clean, Component-Based Layout

```tsx
export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listing, loading } = useListing(id);
  const { isFavorite, toggleFavorite } = useFavorites(id);
  const [shareVisible, setShareVisible] = useState(false);

  if (loading) return <LoadingState />;
  if (!listing) return <ErrorState />;

  return (
    <GradientBackground>
      {/* HEADER */}
      <DetailHeader
        title={listing.title}
        scrollY={scrollY}
        onShare={() => setShareVisible(true)}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* CONTENT */}
      <Animated.ScrollView>
        {/* Image Gallery */}
        <ImageGalleryCard
          images={images}
          featured={listing.featured}
          popular={listing.popular}
          priceLevel={listing.priceLevel}
          workingPeriod={listing.workingPeriod}
        />

        {/* Content Cards */}
        <View style={{ paddingHorizontal: SCREEN_PADDING }}>
          <TitleCard {...listing} />
          <InfoCard {...listing} />
          {listing.youtubeUrl && <VideoCard youtubeUrl={listing.youtubeUrl} />}
          {hasMap && <MapCard {...mapProps} />}
          {hasSocial && <SocialCard {...socialProps} />}
        </View>
      </Animated.ScrollView>

      {/* Contact Bar */}
      <ContactBar
        phone={listing.phone}
        whatsapp={listing.whatsapp}
        email={listing.email}
      />

      {/* Share Modal */}
      <ShareModal
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title={listing.title}
      />
    </GradientBackground>
  );
}
```

---

## 🎨 STYLING GUIDELINES

### Card Style Pattern
```tsx
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
```

### Badge Bubble Pattern
```tsx
const badgeBubble = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
};
```

### Section Title Pattern
```tsx
const sectionTitle = {
  fontSize: 18,
  fontWeight: "700",
  color: theme.text,
  marginBottom: 12,
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
};
```

---

## ⚡ IMPLEMENTATION ORDER

### Week 1: Core Components
1. ✅ Create PageHeader component
2. ✅ Create DetailHeader component
3. ✅ Update all pages to use new headers
4. ✅ Create ImageGalleryCard with badges

### Week 2: Detail Cards
5. ✅ Create TitleCard component
6. ✅ Create InfoCard component
7. ✅ Create VideoCard component
8. ✅ Create MapCard component
9. ✅ Create SocialCard component
10. ✅ Create ContactBar component

### Week 3: Features
11. ✅ Implement ShareModal
12. ✅ Implement useFavorites hook
13. ✅ Integrate favorites storage
14. ✅ Test all components

### Week 4: Polish
15. ✅ Performance optimization
16. ✅ Add loading states
17. ✅ Add error handling
18. ✅ Final testing

---

## 📂 NEW FILE STRUCTURE

```
src/
├── components/
│   ├── cards/
│   │   ├── ImageGalleryCard.tsx        [NEW]
│   │   ├── BadgeBubble.tsx             [NEW]
│   │   └── listing/                    [NEW FOLDER]
│   │       ├── TitleCard.tsx
│   │       ├── InfoCard.tsx
│   │       ├── VideoCard.tsx
│   │       ├── MapCard.tsx
│   │       └── SocialCard.tsx
│   ├── modals/
│   │   └── ShareModal.tsx              [NEW]
│   └── ui/
│       ├── PageHeader.tsx              [NEW]
│       ├── DetailHeader.tsx            [NEW]
│       └── ContactBar.tsx              [NEW]
├── hooks/
│   └── useFavorites.ts                 [NEW]
└── utils/
    └── favoriteStorage.ts              [NEW]
```

---

## ✅ READY TO START!

**Next Step:** Create PageHeader and DetailHeader components

Would you like me to proceed with Phase 1?
