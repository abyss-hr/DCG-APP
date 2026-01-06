# TODO: [id].tsx - Listing Details Page Step-by-Step Plan

## 📋 DATABASE FIELDS INVENTORY

### All Available Fields from Firebase (24 fields total)

| # | Field Name | Type | Currently Used? | Notes |
|---|------------|------|-----------------|-------|
| 1 | `id` | string | ✅ Yes | Used for fetching |
| 2 | `title` | string | ✅ Yes | Hero overlay + header |
| 3 | `description` | string | ✅ Yes | "About" section |
| 4 | `descriptionFeatured` | string? | ✅ Yes | Featured box (if exists) |
| 5 | `categoryId` | string | ❌ No | Not needed on UI |
| 6 | `categoryName` | string | ✅ Yes | Info grid |
| 7 | `filterMain` | string | ✅ Yes | Tag chip |
| 8 | `filterExtra` | string | ✅ Yes | Tag chip |
| 9 | `locationMain` | string | ✅ Yes | Hero overlay |
| 10 | `locationSub` | string? | ✅ Yes | Hero overlay (if exists) |
| 11 | `googleMapUrl` | string | ❌ No | **TODO: Add button** |
| 12 | `coordinates` | string | ✅ Yes | Static map |
| 13 | `youtubeUrl` | string? | ✅ Yes | Video button |
| 14 | `phone` | string | ✅ Yes | Contact bar |
| 15 | `whatsapp` | string? | ✅ Yes | Contact bar |
| 16 | `email` | string | ✅ Yes | Contact bar |
| 17 | `website` | string? | ✅ Yes | Social row |
| 18 | `facebook` | string? | ✅ Yes | Social row |
| 19 | `instagram` | string? | ✅ Yes | Social row |
| 20 | `priceLevel` | string? | ✅ Yes | Info grid |
| 21 | `workingPeriod` | string? | ✅ Yes | Info grid |
| 22 | `featuredImageUrl` | string | ✅ Yes | Hero swiper |
| 23 | `galleryImageUrls` | string[] | ✅ Yes | Hero swiper |
| 24 | `featured` | boolean | ✅ Yes | Badge |
| 25 | `popular` | boolean | ✅ Yes | Badge |
| 26 | `status` | string | ✅ Yes | Validation only |
| 27 | `createdAt` | any? | ❌ No | **TODO: Add timestamp** |
| 28 | `updatedAt` | any? | ❌ No | Not needed |

---

## 📊 CURRENT DATABASE FIELDS VS PAGE DISPLAY

---

## 🎯 WHAT WE WANT TO SHOW ON [id].tsx PAGE

### Current Page Structure (Good Foundation ✅)
1. **Hero Section** (300px height)
   - Image gallery swiper ✅
   - Title overlay ✅
   - Location overlay ✅
   - Featured/Popular badge ✅

2. **Featured Description Box** (if exists) ✅

3. **Filter Tags Row** ✅

4. **About Section** (description) ✅

5. **Details Section** (info grid)
   - Category ✅
   - Price level ✅
   - Working period ✅

6. **Video Section** (if youtubeUrl exists) ✅

7. **Map Section** ✅
   - Static map ✅
   - "Open in Maps" button ✅

8. **Social Section** (if any exist) ✅
   - Website ✅
   - Facebook ✅
   - Instagram ✅

9. **Contact Bar** (bottom fixed) ✅
   - Phone ✅
   - WhatsApp ✅
   - Email ✅

---

## 🔧 IMPROVEMENTS NEEDED (Step-by-Step)

### ✅ CURRENT STATUS: 22/24 fields used (91.6%)

### Missing Features to Add:

#### 🎯 Priority 1: Add Missing Database Fields

- [ ] **Step 1.1: Add Google Maps URL button**
  - Where: In "Location" section, next to "Open in Maps"
  - Field: `googleMapUrl`
  - Action: Add second button for web users
  
- [ ] **Step 1.2: Add timestamp display**
  - Where: Bottom of page or in Details section
  - Field: `createdAt`
  - Action: Show "Added on [date]" for freshness

#### 🎯 Priority 2: UI/UX Polish

- [ ] **Step 2.1: Improve hero overlay**
  - Current: Basic rgba(0,0,0,0.45) overlay
  - Improvement: Add gradient overlay (top transparent → bottom dark)
  - Better text readability

- [ ] **Step 2.2: Add theme colors to components**
  - Current: Some hardcoded colors (black buttons, white text)
  - Improvement: Use `theme.button`, `theme.cardBackground`, etc.
  - Better dark/light mode support

- [ ] **Step 2.3: Enhance social buttons**
  - Current: Simple icon-only buttons
  - Improvement: Add labels + brand colors
  - Better user understanding

- [ ] **Step 2.4: Improve video button**
  - Current: Simple black button
  - Improvement: YouTube thumbnail preview with play overlay
  - More engaging visual

- [ ] **Step 2.5: Add card backgrounds**
  - Current: Sections have no backgrounds
  - Improvement: Add `theme.cardBackground` to sections
  - Better visual separation

#### 🎯 Priority 3: New Features

- [ ] **Step 3.1: Add Share button**
  - Where: Header right icon
  - Action: Share listing title/link
  - User engagement

- [ ] **Step 3.2: Add Favorites/Save button**
  - Where: Header right icon (heart)
  - Action: Save to local favorites
  - User retention

- [ ] **Step 3.3: Add image placeholder**
  - Where: Hero section (if no images)
  - Action: Show nice placeholder with icon
  - Handle edge case

- [ ] **Step 3.4: Add loading/error states**
  - Current: Basic text only
  - Improvement: Icon + styled message + retry button
  - Better UX

---

## 📝 STEP-BY-STEP IMPLEMENTATION PLAN

### Phase 1: Complete Database Coverage (30 min)
1. Add Google Maps button to Location section
2. Add timestamp to Details section

### Phase 2: Theme Integration (45 min)
3. Replace hardcoded colors with theme tokens
4. Add card backgrounds to sections
5. Improve contact bar styling

### Phase 3: Enhanced Components (60 min)
6. YouTube thumbnail preview
7. Better social buttons with labels
8. Gradient hero overlay
9. Image placeholder

### Phase 4: New Features (60 min)
10. Share functionality
11. Favorites/save functionality
12. Better loading/error states

---

## 🎨 DESIGN DECISIONS

### Keep Current Approach:
✅ Hero with overlay (good for hero images)
✅ Sections with titles (clear organization)
✅ Fixed contact bar (easy access to contact)
✅ Tag chips (visual category indicators)
✅ Info grid (compact info display)

### Improvements:
🔄 Add proper theming (use theme colors)
🔄 Add more spacing/padding (breathing room)
🔄 Better visual hierarchy (size/weight)
🔄 Add shadows/elevation (depth)

---

**Ready to implement step-by-step!**
*Each step will be a small, testable change.*

---

*Last Updated: 14. prosinca 2025.*

| Field | Status | Implementation |
|-------|--------|----------------|
| `title` | ✅ Shown | Header + Card title |
| `description` | ✅ Shown | Main description text |
| `categoryName` | ✅ Shown | Info row |
| `locationMain` | ✅ Shown | Info row |
| `locationSub` | ✅ Shown | Info row (if exists) |
| `priceLevel` | ✅ Shown | Info row (if exists) |
| `workingPeriod` | ✅ Shown | Info row (if exists) |
| `featuredImageUrl` | ✅ Shown | Image gallery (swiper) |
| `galleryImageUrls` | ✅ Shown | Image gallery (swiper) |
| `coordinates` | ✅ Shown | Static map + "Open in Maps" button |
| `phone` | ✅ Shown | Contact bar - Call button |
| `whatsapp` | ✅ Shown | Contact bar - WhatsApp button |
| `email` | ✅ Shown | Contact bar - Email button |
| `featured` | ✅ Shown | Badge with award icon |
| `popular` | ✅ Shown | Badge with star icon |

---

### ❌ DATABASE FIELDS NOT DISPLAYED

| Field | Available in DB | Suggested Implementation |
|-------|-----------------|--------------------------|
| `descriptionFeatured` | ✅ Yes | Show alternate description for featured listings |
| `categoryId` | ✅ Yes | Not needed on UI (categoryName is shown) |
| `filterMain` | ✅ Yes | Could show as tags/chips |
| `filterExtra` | ✅ Yes | Could show as additional tags/chips |
| `googleMapUrl` | ✅ Yes | Add "View on Google Maps" button |
| `youtubeUrl` | ✅ Yes | **IMPORTANT** - Embed video or "Watch Video" button |
| `website` | ✅ Yes | **MISSING** - Add to contact bar or info section |
| `facebook` | ✅ Yes | **MISSING** - Add social media section |
| `instagram` | ✅ Yes | **MISSING** - Add social media section |
| `status` | ✅ Yes | Used for validation only (correct) |
| `createdAt` | ✅ Yes | Could show "Added on [date]" |
| `updatedAt` | ✅ Yes | Could show "Last updated [date]" |

---

## 🎯 RECOMMENDED IMPROVEMENTS

### Priority 1: HIGH IMPACT (Add These First)

- [ ] **1.1 YouTube Video Player**
  - Currently: `youtubeUrl` field exists but not displayed
  - Solution: Add YouTube embed or "Watch Video" button below images
  - Impact: HIGH - Video content is engaging

- [ ] **1.2 Website Link**
  - Currently: `website` field exists but not shown
  - Solution: Add "Visit Website" button to contact bar
  - Impact: HIGH - Direct traffic to business website

- [ ] **1.3 Social Media Links**
  - Currently: `facebook` & `instagram` fields not shown
  - Solution: Add social media icon row (Facebook, Instagram)
  - Impact: MEDIUM - Users expect to follow on social

- [ ] **1.4 Google Maps URL**
  - Currently: `googleMapUrl` field not used
  - Solution: Add "View on Google Maps" button (alternative to native maps)
  - Impact: MEDIUM - Better web compatibility

### Priority 2: ENHANCED UX

- [ ] **2.1 Featured Description**
  - Currently: `descriptionFeatured` field ignored
  - Solution: Show `descriptionFeatured` when `featured === true`
  - Impact: MEDIUM - Better featured content

- [ ] **2.2 Filter Tags/Chips**
  - Currently: `filterMain` & `filterExtra` not shown
  - Solution: Display as colored chips below category
  - Impact: LOW-MEDIUM - Visual category indicators

- [ ] **2.3 Timestamps**
  - Currently: `createdAt` / `updatedAt` not shown
  - Solution: Add "Added on [date]" or "Updated [date]" in footer
  - Impact: LOW - Builds trust/freshness

### Priority 3: POLISH & STYLING

- [ ] **3.1 Card Backgrounds**
  - Currently: Info card has no background color
  - Solution: Add `backgroundColor: theme.cardBackground` to cards
  - Impact: LOW - Better visual separation

- [ ] **3.2 Price Level Indicator**
  - Currently: Shows raw text (e.g., "$$")
  - Solution: Style with icons or colored chips
  - Impact: LOW - Better visual appeal

- [ ] **3.3 Working Hours Formatting**
  - Currently: Shows raw text
  - Solution: Parse and format nicely (if possible)
  - Impact: LOW - Better readability

- [ ] **3.4 Share Button**
  - Currently: Not implemented
  - Solution: Add share icon in header to share listing
  - Impact: MEDIUM - Viral growth potential

- [ ] **3.5 Favorite/Save Button**
  - Currently: Not implemented
  - Solution: Add heart icon to save to favorites
  - Impact: HIGH - User engagement & retention

---

## 🐛 POTENTIAL ISSUES TO FIX

- [ ] **Contact bar might overflow** if all contact methods exist
  - Solution: Make scrollable horizontally or use 2 rows
  
- [ ] **No image placeholder** if `images.length === 0`
  - Solution: Show placeholder image or default gradient
  
- [ ] **Map doesn't handle invalid coordinates gracefully**
  - Currently: Checks `hasMap` but could validate better
  
- [ ] **No error boundary** if listing fetch fails
  - Solution: Add error state UI with retry button

---

## 📝 IMPLEMENTATION CHECKLIST

### Quick Wins (< 30 min)
- [ ] Add website button to contact bar
- [ ] Add YouTube video section
- [ ] Add social media links row
- [ ] Add card backgrounds

### Medium Tasks (30-60 min)
- [ ] Implement featured description logic
- [ ] Add filter tags/chips display
- [ ] Add Google Maps button
- [ ] Add share functionality

### Larger Tasks (60+ min)
- [ ] Implement favorites/save feature
- [ ] Improve contact bar layout (responsive)
- [ ] Add image placeholder/fallback
- [ ] Refactor into smaller components

---

## 🎨 PROPOSED NEW SECTIONS

1. **Video Section** (if youtubeUrl exists)
2. **Social Media Row** (Facebook, Instagram icons)
3. **Additional Links** (Website, Google Maps)
4. **Tags/Filters** (Visual chips for filterMain/filterExtra)
5. **Metadata Footer** (Created/Updated dates)

---

**Total Fields in DB:** 24
**Currently Displayed:** 15 (62.5%)
**Missing/Not Used:** 9 (37.5%)

---

*Last Updated: 14. prosinca 2025.*
