# LISTING DETAIL PAGE - Component Structure & Implementation Plan

**Created:** 17. prosinca 2025.
**Updated:** 17. prosinca 2025. - Final Merged Structure (ChatGPT + Claude)
**Status:** 🚧 Ready to Start - Phase 1
**Location:** `src/pages/listing/`

---

## 📁 FINAL FILE STRUCTURE

```
src/pages/listing/
├── header/
│   └── ListingHeader.tsx        # Header with back, share, favorite buttons
│
├── media/
│   ├── images/
│   │   ├── ListingGallery.tsx   # Image swiper with arrows, auto-slide
│   │   └── ListingImageBadges.tsx  # All badges: featured, popular, price, season
│   └── video/
│       └── ListingVideo.tsx     # YouTube player (positioned below map)
│
├── content/
│   ├── ListingTitle.tsx         # Title + Category SVG icon (right side)
│   ├── ListingBadges.tsx        # Reusable status badges
│   ├── ListingDescription.tsx   # Main + Featured descriptions (2 cards)
│   ├── ListingInfoCard.tsx      # Category chips (clickable → category page)
│   └── ListingTags.tsx          # Optional: Search filters (if needed)
│
├── map/
│   ├── ListingMapSection.tsx    # Map + zoom/fullscreen buttons
│   └── ListingMapButton.tsx     # "Open Map & Take Me There" CTA
│
├── contacts/
│   ├── ListingContactBar.tsx    # Bottom bar: Phone, WhatsApp, Email
│   └── ListingSocialLinks.tsx   # Social media card (website, FB, IG)
│
├── types.ts                     # TypeScript interfaces
└── index.ts                     # Export all components

# Card Wrapper (Reuse Existing):
src/components/cards/ListingCard.tsx  # ✅ Already exists - repurpose as Card wrapper

# Route File (No Changes):
app/(drawer)/(listing)/[id].tsx  # Stays as route entry point
```

**Key Changes from Original Plan:**
- ✅ Merged badge components into single `ListingImageBadges.tsx`
- ✅ Cleaner media folder structure (images/ and video/ separated)
- ✅ Reusing existing `ListingCard.tsx` as Card wrapper
- ✅ Clearer separation: Tags vs Badges
- ✅ Video positioned below map (as requested)

---

## 🎯 PHASE 1: FOUNDATION (START HERE)

### ✅ Task 1.1: Create Folder Structure ✅ COMPLETE
- [x] Create `src/pages/listing/` main folder
- [x] Create `header/` subfolder
- [x] Create `media/` subfolder
- [x] Create `media/images/` subfolder
- [x] Create `media/video/` subfolder
- [x] Create `content/` subfolder
- [x] Create `map/` subfolder
- [x] Create `contacts/` subfolder
- [x] Create `types.ts` file
- [x] Create `index.ts` file

**Status:** ✅ Complete - All folders and files created

### ✅ Task 1.2: Setup Card Wrapper Component ✅ COMPLETE
**File:** `src/components/ui/Card.tsx`

**Action:** Created new Card wrapper component
- [x] Created Card.tsx component
- [x] Props: `children`, `style?`, `visible?` (conditional rendering)
- [x] Styling: 
  - Background from theme.cardBackground
  - Border radius: 16px
  - Padding: 16px
  - Margin: 12px bottom
  - Shadow/elevation for depth
  - Dark mode support via theme

**Status:** ✅ Complete - Card wrapper ready to use

### ✅ Task 1.3: Define TypeScript Types ✅ COMPLETE
**File:** `src/pages/listing/types.ts`

**Interfaces created:**
- [x] `ListingHeaderProps` - Header component props
- [x] `GalleryProps` - Gallery component props
- [x] `ImageBadgesProps` - All image badges props
- [x] `TitleProps` - Title with icon props
- [x] `DescriptionProps` - Description props
- [x] `InfoCardProps` - Info card props
- [x] `MapSectionProps` - Map component props
- [x] `ContactBarProps` - Contact bar props
- [x] `SocialLinksProps` - Social links props
- [x] `VideoProps` - Video player props
- [x] `TagsProps` - Tags component props
- [x] `BadgeProps` - Badge component props
- [x] `CardProps` - Card wrapper props

**Status:** ✅ Complete - All types defined

### ✅ Task 1.4: Create index.ts Exports ✅ COMPLETE
**File:** `src/pages/listing/index.ts`

- [x] Export all components for easy imports
- [x] Export all types
- [x] Group exports by category (Header, Media, Content, Map, Contacts)

**Status:** ✅ Complete - Central export point ready

### ✅ Task 1.5: Create Placeholder Components ✅ COMPLETE
**Action:** Created all placeholder components

**Components created:**
- [x] `header/ListingHeader.tsx`
- [x] `media/images/ListingGallery.tsx`
- [x] `media/images/ListingImageBadges.tsx`
- [x] `media/video/ListingVideo.tsx`
- [x] `content/ListingTitle.tsx`
- [x] `content/ListingBadges.tsx`
- [x] `content/ListingDescription.tsx`
- [x] `content/ListingInfoCard.tsx`
- [x] `content/ListingTags.tsx`
- [x] `map/ListingMapSection.tsx`
- [x] `map/ListingMapButton.tsx`
- [x] `contacts/ListingContactBar.tsx`
- [x] `contacts/ListingSocialLinks.tsx`

**Status:** ✅ Complete - All placeholders ready

---

## 📊 PHASE 1 SUMMARY

**Status:** ✅ **COMPLETE** - Ready for Phase 2

**What was accomplished:**
1. ✅ Complete folder structure created
2. ✅ Card wrapper component ready
3. ✅ 13 TypeScript interfaces defined
4. ✅ Central export index created
5. ✅ 13 placeholder components created
6. ✅ No TypeScript errors

**Files created:**
- 1 Card wrapper (`src/components/ui/Card.tsx`)
- 1 Types file (`src/pages/listing/types.ts`)
- 1 Index file (`src/pages/listing/index.ts`)
- 13 Component placeholders

**Total:** 16 new files ✅

**Next step:** Ready to start Phase 2 - Core Visual Content
- [ ] Create `src/pages/listing/` main folder
- [ ] Create `header/` subfolder
- [ ] Create `media/` subfolder
- [ ] Create `media/images/` subfolder
- [ ] Create `media/video/` subfolder
- [ ] Create `content/` subfolder
- [ ] Create `map/` subfolder
- [ ] Create `contacts/` subfolder
- [ ] Create `types.ts` file
- [ ] Create `index.ts` file

**Terminal command:**
```bash
mkdir -p src/pages/listing/{header,media/{images,video},content,map,contacts}
touch src/pages/listing/types.ts
touch src/pages/listing/index.ts
```

### ✅ Task 1.2: Setup Card Wrapper Component
**File:** `src/cCORE VISUAL CONTENT

### ✅ Task 2.1: ListingHeader.tsx
**Location:** `src/pages/listing/header/ListingHeader.tsx`

**Features:**
- [ ] Reuse UniversalHeader component
- [ ] Left: Back button (auto-back)
- [ ] Right: Share button + Favorite button
- [ ] Share functionality (native Share API)
- [ ] Favorite toggle (integrate FavoritesContext)
- [ ] Haptic feedback on all buttons
- [ ] Scroll behavior (hide/show on scroll)

**Props needed:**
- `title: string`
- `listingId: string`
- `scrollY: Animated.Value`

**Implementation:**
```typescript
<UniversalHeader
  title={title}
  scrollY={scrollY}
  left={{ icon: "back", autoBack: true }}
  rightIcons={[
    { icon: "share", onPress: handleShare },
    { icon: "heart", onPress: handleFavorite }
  ]}
/>
```

---

### ✅ Task 2.2: ListingGallery.tsx
**Location:** `src/pages/listing/media/images/ListingGallery.tsx`

**Features:**
- [ ] Image swiper (react-native-swiper)
- [ ] Left/right arrow navigation
- [ ] Auto-slide every 2 seconds (pause on interaction)
- [ ] Lazy loading for performance
- [ ] Image index indicator (bottom-right) - "1/5"
- [ ] Integrate ListingImageBadges component
- [ ] Wrapped in Card component
- [ ] Hide if no images available (return null)

**Props needed:**
```typescript
interface GalleryProps {
  images: string[];
  featured?: boolean;
  popular?: boolean;
  seasonal?: boolean;
  priceLevel?: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}
```

**Layout:**
- Height: 240-300px
- Width: Full width minus padding
- Border radius: 16px
- Badges overlay on images

---

### ✅ Task 2.3: ListingImageBadges.tsx (Single File - All Badges)
**Location:** `src/pages/listing/media/images/ListingImageBadges.tsx`

**Features:**
All badges in ONE component with smart positioning:

**Top-Left Corner (stacked vertically):**
- [ ] Featured badge (if `featured === true`)
  - Icon: Award/Trophy from Lucide
  - Text: "Featured"
  - Color: Gold/Yellow
  
- [ ] Popular badge (if `popular === true`)
  - Icon: Star from Lucide
  - Text: "Popular"
  - Color: Orange/Accent

**Top-Right Corner:**
- [ ] Season badge (if seasonal data available)
  - Text: "Seasonal" or "Year Round"
  - Icon: Calendar/Clock from Lucide
  - Color: Blue/Info

**Bottom-Left Corner:**
- [ ] Price badge (if `priceLevel` exists)
  - Text: "$", "$$", "$$$", "$$$$"
  - No icon, just symbols
  - Color: Green/Success

**Bottom-Right Corner:**
- [ ] Reserved for image counter (handled in Gallery)

**Props needed:**
```typescript
interface ImageBadgesProps {
  featured?: boolean;
  popular?: boolean;
  seasonal?: boolean;
  priceLevel?: string;
}
```

**Badge styling:**
- Semi-transparent background
- Rounded corners
- Small padding
- Icon + text layout
- Conditional rendering (only show if data exists)

---

### ✅ Task 2.4: ListingTitle.tsx
**Location:** `src/pages/listing/content/ListingTitle.tsx`

**Features:**
- [ ] Title text (left side, flex: 1)
- [ ] Category SVG icon (right side, fixed size)
- [ ] Dynamic icon based on category
- [ ] Wrapped in Card component
- [ ] Row layout (flexDirection: row)

**Props needed:**
```typescript
interface TitleProps {
  title: string;
  categoryName: string;
}
```

**Icon mapping (create helper function):**
```typescript
const getCategoryIcon = (category: string) => {
  const iconMap = {
    'Traditional': AppIcons.fish,
    'Pizza': AppIcons.pizza,
    'Hiking': AppIcons.mountain,
    'Kayaking': AppIcons.kayak,
    'Beach': AppIcons.waves,
    // etc - add all categories
  };
  return iconMap[category] || AppIcons.default;
};
```

**Layout:**
- Title: fontSize 24, fontWeight bold
- Icon: size 32, color theme.button
- Gap: 12px between title and icon

---

### ✅ Task 2.5: ListingBadges.tsx (Reusable Status Badges)
**Location:** `src/pages/listing/content/ListingBadges.tsx`

**Purpose:** Reusable badge component for any status indicator

**Features:**
- [ ] Generic badge component
- [ ] Can be used in gallery, title section, or elsewhere
- [ ] Props: icon, text, color
- [ ] Small, compact design

**Props needed:**
```typescript
interface BadgeProps {
  icon?: IconName;
  text: string;
  color?: string;
  variant?: 'featured' | 'popular' | 'new' | 'seasonal';
}
```

**Usage:**
```typescript
<ListingBadges variant="featured" text="Featured" />
<ListingBadges variant="popular" text="Popular" />
```
export interface ImageBadgesProps {
  featured?: boolean;
  popular?: boolean;
  seasonal?: boolean;
  priceLevel?: string;
}
```

### ✅ Task 1.4: Create index.ts Exports
**File:** `src/pages/listing/index.ts`

- [ ] Export all components for easy imports
- [ ] Export all types
- [ ] Group exports by category

**Structure:**
```typescript
// Header
export { ListingHeader } from './header/ListingHeader';

// Media
export { ListingGallery } from './media/images/ListingGallery';
export { ListingImageBadges } from './media/images/ListingImageBadges';
export { ListingVideo } from './media/video/ListingVideo';

// Content
export { ListingTitle } from './content/ListingTitle';
// ... etc

// Types
export * from './types';
```

### ✅ Task 1.5: Update [id].tsx with Placeholders
**File:** `app/(drawer)/(listing)/[id].tsx`

- [ ] Keep existing data fetching logic
- [ ] Import Card wrapper
- [ ] Add placeholder sections for each component
- [ ] Test that page still renders
- [ ] No functionality yet - just structure

**Example structure:**
```typescript
<ScrollView>
  <Card><Text>Gallery placeholder</Text></Card>
  <Card><Text>Title placeholder</Text></Card>
  <Card><Text>Description placeholder</Text></Card>
  {/* etc */}
</ScrollView>
```

---

## 🖼️ PHASE 2: IMAGES & GALLERY

### ✅ Task 2.1: ListingGallery.tsx
**Location:** `src/pages/listing/images/ListingGallery.tsx`

**Features:**
- [ ] Image swiper with left/right arrows
- [ ] Auto-slide every 2 seconds
- [ ] Lazy loading for performance
- [ ] Image index indicator (bottom-right corner) - "1/5"
- [ ] Integrate all badge components (see below)
- [ ] Card styling (separated from background)
- [ ] Hide if no images available

**Props needed:**
- `images: string[]`
- `featured: boolean`
- `popular: boolean`
- `seasonal: boolean`
- `priceLevel: string`

---

### ✅ Task 2.2: Badge Components

#### SeasonBadge.tsx
**Location:** `src/pages/listing/images/badges/SeasonBadge.tsx`
- [ ] Position: Top-right corner
- [ ] Show "Seasonal" or "Year Round"
- [ ] Icon + text in small badge
- [ ] Only show if data available

#### FeaturedBadge.tsx
**Location:** `src/pages/listing/images/badges/FeaturedBadge.tsx`
- [ ] Position: Top-left corner (first badge)
- [ ] Icon: Award/trophy from Lucide
- [ ] Text: "Featured"
- [ ] Only show if `listing.featured === true`

#### PopularBadge.tsx
**Location:** `src/pages/listing/images/badges/PopularBadge.tsx`
- [ ] Position: Top-left corner (second badge, below featured)
- [ ] Icon: Star from Lucide
- [ ] Text: "Popular"
- [ ] Only show if `listing.popular === true`

#### PriceBadge.tsx
**Location:** `src/pages/listing/images/badges/PriceBadge.tsx`
- [ ] Position: Bottom-left corner
- [ ] Show price symbols: $, $$, $$$, $$$$
- [ ] Only show if `listing.priceLevel` exists

---

## 🎬 PHASE 3: VIDEO SECTION

### ✅ Task 3.1: ListingVideo.tsx
**Location:** `src/pages/listing/video/ListingVideo.tsx`

**Features:**
- [ ] YouTube player embed
- [ ] Play button overlay
- [ ] Card styling
- [ ] Position: BELOW map section
- [ ] Only show if `listing.youtubeUrl` exists
- [ ] Handle video loading states

**Props needed:**
- `youtubeUrl?: string`

**Implementation notes:**
- Use `react-native-youtube-iframe` or WebView
- Add error handling for invalid URLs

---

## 📝 PHASE 4: CONTENT SECTIONS

### ✅ Task 4.1: ListingTitle.tsx
**Location:** `src/pages/listing/content/ListingTitle.tsx`

**Features:**
- [ ] Full title text (left side)
- [ ] Category SVG icon (right side, same row)
- [ ] Icon changes per category:
  - Restaurant/Traditional → Fish icon
  - Restaurant/Pizza → Pizza icon
  - Experience/Hiking → Mountain icon
  - Experience/Kayaking → Kayak icon
  - Beach → Waves icon
  - etc.
- [ ] RECOMMENDED IMPLEMENTATION ORDER

### **Phase 1: Foundation** ⭐ START HERE (1-2 hours)
1. Create folder structure (Task 1.1)
2. Repurpose Card wrapper (Task 1.2)
3. Define all TypeScript types (Task 1.3)
4. Create index.ts exports (Task 1.4)
5. Add placeholders in [id].tsx (Task 1.5)

**Deliverable:** Folder structure + Card wrapper + Types defined

---

### **Phase 2: Core Visual Content** (3-4 hours)
6. ListingHeader with share/favorite (Task 2.1)
7. ListingGallery with swiper (Task 2.2)
8. ListingImageBadges (all 4 badges) (Task 2.3)
9. ListingTitle with category icon (Task 2.4)
10. ListingBadges reusable component (Task 2.5)

**Deliverable:** Gallery working + Title + Header complete

---

### **Phase 3: Information Content** (2-3 hours)
11. ListingInfoCard with chips (Task 4.4)
12. ListingDescription (main + featured) (Task 4.2-4.3)
13. Test clickable category chips

**Deliverable:** All text content displaying correctly

---

### **Phase 4: Map & Navigation** (2-3 hours)
14. ListingMapSection with zoom/fullscreen (Task 5.1)
15. ListingMapButton (Open in Maps) (Task 5.2)
16. Test map interactions

**Deliverable:** Map fully functional

---

### **Phase 5: Contacts & Social** (2 hours)
17. ListingContactBar (modern buttons) (Task 6.1)
18. ListingSocialLinks (Task 6.2)
19. Test all contact actions

**Deliverable:** Contact/social features working

---

### **Phase 6: Enhancements & Polish** (2-3 hours)
20. ListingVideo (YouTube player) (Task 3.1)
21. ListingTags (if needed) (Task 4.5)
22. Animations & loading states (Task 7.2)
23. Responsive design testing (Task 7.3)
24. FuKEY DECISIONS & CLARIFICATIONS

### ✅ Decision 1: Card Wrapper Component
**Decision:** Reuse existing `src/components/cards/ListingCard.tsx`
- **Status:** NOT currently used in codebase
- **Action:** Repurpose as simple Card wrapper
- **Benefits:** 
  - Visual consistency
  - Easy theme updates
  - Less code duplication

### ✅ Decision 2: Header Implementation
**Decision:** Keep UniversalHeader (NO separate _layout.tsx)
- **Reason:** 
  - Already consistent with other pages
  - Easy to add Share + Favorite buttons
  - Custom scroll behavior works well
  - No need for route-level layout

### ✅ Decision 3: Badge Structure
**Decision:** Single `ListingImageBadges.tsx` component (not 4 separate files)
- **Badges included:** Featured, Popular, Seasonal, Price
- **Positioning:** Smart positioning based on which badges are active
- **Benefits:** Simpler, less files, easier to maintain

### ✅ Decision 4: Media Folder Organization
**Decision:** Separate `images/` and `video/` folders under `media/`
- **Reason:**
  - Gallery is complex (badges, lazy loading, swiper)
  - Video is simple, heavy, optional
  - Clear separation of concerns
  - Video positioned below map (not with images)

### ✅ Decision 5: Tags vs Badges Clarification
**Tags** = Search/filter metadata (Kayaking, Family Friendly, Outdoor)
- Used for filtering/searching
- Shown in content section
- Optional component

**Badges** = Status indicators (Featured, Popular, New, Seasonal)
- Visual status markers
- Shown in gallery and content
- Reusable component

### 📝 To Be Implemented: Icon Mapping
Create category icon helper in `src/pages/listing/content/ListingTitle.tsx`:
```typescript
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, React.ComponentType> = {
    'Traditional': AppIcons.fish,
    'Pizza': AppIcons.pizza,
    'Seafood': AppIcons.fish,
    'Hiking': AppIcons.mountain,
    'Kayaking': AppIcons.kayak,
    'Beach': AppIcons.waves,
    'Restaurant': AppIcons.utensils,
    'Bar': AppIcons.glassWater,
    // Add more mappings as needed
  };
  return iconMap[categoryName] || AppIcons.mapPin; // Default fallback
}; [ ] Show price level
- [ ] Show working period/hours
- [ ] Each chip is clickable → navigates to category listings
- [ ] Card styling
- [ ] Grid/flex layout for chips

**Props needed:**
- `categoryName: string`
- `locationMain: string`
- `locationSub?: string`
- `priceLevel?: string`
- `workingPeriod?: string`

**Navigation:**
- On chip press → navigate to category listing page

---

### ✅ Task 4.5: ListingTags.tsx (Optional)
**Location:** `src/pages/listing/content/ListingTags.tsx`

**Purpose:** Display filter tags (beach type, food type, etc.)
- [ ] Determine what tags to show
- [ ] Small chip design
- [ ] Card styling
- [ ] Only show if tags exist

**Status:** ⚠️ Need clarification on tag data structure

---

### ✅ Task 4.6: ListingBadges.tsx (Optional)
**Location:** `src/pages/listing/content/ListingBadges.tsx`

**Purpose:** Additional status badges
- [ ] Determine what badges to show
- [ ] Badge design

**Status:** ⚠️ Need clarification on badge types

---

## 🗺️ PHASE 5: MAP SECTION

### ✅ Task 5.1: ListingMapSection.tsx
**Location:** `src/pages/listing/map/ListingMapSection.tsx`

**Features:**
- [ ] Display map with location pin
- [ ] Zoom in/out buttons (right side inside map)
- [ ] Fullscreen button (right side inside map)
- [ ] Fullscreen opens `app/(drawer)/(listing)/map.tsx`
- [ ] Card styling
- [ ] Only show if coordinates exist

**Props needed:**
- `latitude: number`
- `longitude: number`
- `title: string` (for marker label)

**Buttons:**
- Zoom In icon (top-right)
- Zoom Out icon (middle-right)
- Fullscreen icon (bottom-right)

---

### ✅ Task 5.2: ListingMapButton.tsx
**Location:** `src/pages/listing/map/ListingMapButton.tsx`

**Features:**
- [ ] Large CTA button: "Open Map & Take Me There"
- [ ] Opens native maps app (iOS Maps / Google Maps)
- [ ] Modern button styling
- [ ] Icon + text
- [ ] Only show if coordinates exist

**Props needed:**
- `latitude: number`
- `longitude: number`
- `title: string`

**Functionality:**
- iOS: Open Apple Maps
- Android: Open Google Maps

---

## 📞 PHASE 6: CONTACT & SOCIAL

### ✅ Task 6.1: ListingContactBar.tsx
**Location:** `src/pages/listing/contacts/ListingContactBar.tsx`

**Features:**
- [ ] Fixed bottom bar (like current)
- [ ] Modern button design with outlines
- [ ] Phone button: Blue outline, phone icon, "Phone" text
- [ ] WhatsApp button: Green outline, WhatsApp icon, "WhatsApp" text
- [ ] Email button: White/gray outline, mail icon, "Email" text
- [ ] Only show available contact methods
- [ ] Haptic feedback on press
- [ ] Rounded corners
- [ ] Icon + text layout

**Props needed:**
- `phone?: string`
- `whatsapp?: string`
- `email?: string`

**Styling:**
- Blue: `#007AFF` (phone)
- Green: `#25D366` (WhatsApp)
- Gray: `#8E8E93` (email)

---

### ✅ Task 6.2: ListingSocialLinks.tsx
**Location:** `src/pages/listing/contacts/ListingSocialLinks.tsx`

**Features:**
- [ ] Small cards inside one container card
- [ ] Website link with globe icon
- [ ] Facebook link with FB icon
- [ ] Instagram link with IG icon
- [ ] Only show if data exists
- [ ] Open in browser or native app
- [ ] Card styling
- [ ] Icon + label layout

**Props needed:**
- `website?: string`
- `facebook?: string`
- `instagram?: string`

**Layout:**
- Horizontal row or grid
- Icon on left, label on right

---

## 🎨 PHASE 7: STYLING & POLISH

### ✅ Task 7.1: Card Styling System
- [ ] Create shared card styles
- [ ] Background slightly different from page background
- [ ] Border radius: 16px
- [ ] Padding: 16px
- [ ] Margin between cards: 12px
- [ ] Shadow/elevation for depth
- [ ] Dark mode support

### ✅ Task 7.2: Conditional Rendering
- [ ] All components check for data availability
- [ ] Don't show empty cards
- [ ] Graceful fallbacks
- [ ] Loading states

### ✅ Task 7.3: Responsive Design
- [ ] Test on different screen sizes
- [ ] Image gallery adapts
- [ ] Button sizes appropriate
- [ ] Text readable

---

## 🔧 PHASE 8: INTEGRATION

### ✅ Task 8.1: Update [id].tsx Route
- [ ] Import all components from `src/pages/listing/`
- [ ] Replace inline code with components
- [ ] Pass props correctly
- [ ] Maintain scroll behavior
- [ ] Keep UniversalHeader integration

### ✅ Task 8.2: Add Share & Favorite to Header
- [ ] Add Share button to UniversalHeader rightIcons
- [ ] Add Favorite button to UniversalHeader rightIcons
- [ ] Implement share functionality (native Share API)
- [ ] Integrate with FavoritesContext
- [ ] Haptic feedback

### ✅ Task 8.3: Testing
- [ ] Test all components individually
- [ ] Test with missing data (hide properly)
- [ ] Test navigation (category chips, map fullscreen)
- [ ] Test contact actions (call, WhatsApp, email)
- [ ] Test social links
- [ ] Test video player
- [ ] Test on iOS and Android

---

## 📋 IMPLEMENTATION ORDER (Recommended)

**Week 1: Foundation**
1. Setup folder structure (Task 1.1)
2. Define types (Task 1.2)
3. Create card styling system (Task 7.1)

**Week 2: Gallery & Badges**
4. ListingGallery.tsx (Task 2.1)
5. All badge components (Task 2.2)
6. Test gallery with badges

**Week 3: Content**
7. ListingTitle.tsx (Task 4.1)
8. ListingDescription.tsx (Task 4.2)
9. ListingFeaturedDescription.tsx (Task 4.3)
10. ListingInfoCard.tsx (Task 4.4)

**Week 4: Map & Location**
11. ListingMapSection.tsx (Task 5.1)
12. ListingMapButton.tsx (Task 5.2)
13. Test map functionality

**Week 5: Contacts & Social**
14. ListingContactBar.tsx (Task 6.1)
15. ListingSocialLinks.tsx (Task 6.2)
16. Test contact actions

**Week 6: Video & Polish**
17. ListingVideo.tsx (Task 3.1)
18. Conditional rendering (Task 7.2)
19. Responsive design (Task 7.3)
20. Integration & testing (Task 8)

---

## 🚀 QUICK START GUIDE

**To start working:**
1. Create folder structure (copy from FILE STRUCTURE above)
2. Start with Phase 2 (Gallery) - most visual impact
3. Build one component at a time
4. Test in [id].tsx after each component
5. Move to next component

**Component development pattern:**
1. Create TypeScript file
2. Define props interface
3. Add conditional rendering (only show if data exists)
4. Add card styling
5. Add functionality
6. Test with real data
7. Export from index.ts

---

## 📝 NOTES & DECISIONS

### Header Question
**Question:** Should we use `app/(drawer)/(listing)/_layout.tsx` for header or keep UniversalHeader?

**Recommendation:** Keep UniversalHeader
- Already works well
- Consistent with other pages
- Easy to add Share + Favorite buttons
- No need for separate layout

### Tags & Badges Clarification Needed
- [ ] Define what "tags" are (filter categories, beach type, etc.)
- [ ] Define what additional "badges" are needed beyond gallery badges
- [ ] Determine data structure for tags

### Icon Mapping for Categories
Create helper function in `src/pages/listing/content/ListingTitle.tsx`:
```typescript
const getCategoryIcon = (category: string) => {
  // Map category names to Lucide icons
  // Example: "Traditional" → Fish, "Pizza" → Pizza, etc.
}
```

---

## ✅ SUCCESS CRITERIA

**Phase complete when:**
- [ ] All components created and working
- [ ] No TypeScript errors
- [ ] All data conditionally rendered
- [ ] Cards properly styled
- [ ] Navigation works (category chips, maps)
- [ ] Contact actions work (call, WhatsApp, email)
- [ ] Social links work
- [ ] Video player works
- [ ] Share & Favorite work
- [ ] Responsive on all screen sizes
- [ ] Dark mode supported
- [ ] Performance optimized (lazy loading)

---

**Last Updated:** 17. prosinca 2025.
**Status:** Ready to start implementation
**Next Step:** Create folder structure (Phase 1, Task 1.1)
