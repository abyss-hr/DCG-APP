# Admin Panel Documentation (Archived)

**Status:** Feature removed from mobile app  
**Date Archived:** 2026-01-08  
**Reason:** Admin functionality will be moved to web dashboard  
**Future Plan:** Implement on website for database management

---

## Overview

The admin panel was a mobile screen accessible via password-protected settings that displayed system statistics and management options for the DCG app.

### Access Method
- Located at: `app/(drawer)/admin.tsx`
- Access: Via Settings modal → Enter password (2307986) → Navigate to Admin screen
- UI: Drawer navigation item (hidden from main menu, accessible only after authentication)

---

## Features & Functionality

### 1. System Statistics Dashboard

**Total Listings Counter**
- Displays count of all experiences/listings in database
- Real-time count from Firestore
- Shows promoted & popular listing counts (deprecated fields)

**Categories Count**
- Displays number of available activities
- Fetched from `useAvailableActivities()` hook
- Categories include: Sights, Food & Drink, Beach, Experience, etc.

**Locations Count**
- Displays number of available locations
- Fetched from `useAvailableLocations()` hook
- Locations include: Dubrovnik, Koločep, Lopud, Šipan

### 2. Storage & Performance Metrics

**Cached Images**
- Counts total images across all listings
- Shows count of images in Appwrite storage
- Formula: `allExperiences.reduce((sum, exp) => sum + (exp.imageUrls?.length || 0), 0)`

**Database Size Estimate**
- Calculates estimated Firestore database size
- Formula: `(allExperiences.length * 3.5).toFixed(1) KB`
- Note: This is an approximation, not actual storage usage

**Load Time**
- Measures time to fetch all data
- Displays in milliseconds
- Useful for performance monitoring

### 3. Synchronization Info

**Last Sync Date**
- Shows timestamp of most recently updated listing
- Format: `DD MMM YYYY, HH:MM`
- Source: `allExperiences[0].updatedAt` (newest first)

### 4. Quick Actions (Placeholders - Not Implemented)

**Trigger WordPress Sync**
- Intended to: Manually trigger data sync from WordPress/dcgapp.com
- Status: TODO - not implemented
- Use case: Force refresh of listing data from external source

**Manage Image Cache**
- Intended to: Navigate to image management screen
- Status: TODO - not implemented
- Use case: Clear or manage cached images in Appwrite

**Security Settings**
- Intended to: Access security configuration
- Status: TODO - not implemented
- Use case: Manage API keys, permissions, user roles

**System Configuration**
- Intended to: Access system-wide settings
- Status: TODO - not implemented
- Use case: Configure app behavior, feature flags

---

## Technical Implementation

### Data Fetching Hooks

```typescript
// Fetches all experiences/listings
const { data: allExperiences = [] } = useExperiences();

// Fetches available activity categories
const { data: activities = [] } = useAvailableActivities();

// Fetches available location filters
const { data: locations = [] } = useAvailableLocations();
```

### Stats Calculation Logic

```typescript
interface SystemStats {
  totalListings: number;
  promotedListings: number; // Deprecated
  popularListings: number; // Deprecated
  categoriesCount: number; // Activities
  placesCount: number; // Locations
  lastSyncDate: string;
  imagesInStorage: number;
  databaseSize: string;
  avgLoadTime: number;
}

const loadStats = async () => {
  const startTime = Date.now();
  const loadTime = Date.now() - startTime;
  
  // Last sync from newest listing
  const lastSync = allExperiences[0]?.updatedAt 
    ? new Date(allExperiences[0].updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';
  
  // Count images
  const totalImages = allExperiences.reduce(
    (sum, exp) => sum + (exp.imageUrls?.length || 0), 
    0
  );
  
  setStats({
    totalListings: allExperiences.length,
    categoriesCount: activities.length,
    placesCount: locations.length,
    lastSyncDate: lastSync,
    imagesInStorage: totalImages,
    databaseSize: `${(allExperiences.length * 3.5).toFixed(1)} KB`,
    avgLoadTime: loadTime,
  });
};
```

### UI Components

**StatCard** — Displays individual metric with icon
- Icon from Feather icons
- Value + optional subtitle
- Color-coded by metric type

**ActionButton** — Quick action buttons
- Icon + title + chevron
- Haptic feedback on press
- Placeholder for future functionality

---

## Design System

### Color Coding
- **Blue (#4c6cfd)** — Total listings
- **Red (#FF6B6B)** — Categories
- **Cyan (#00D9FF)** — Locations
- **Yellow (#FFB800)** — Images
- **Purple (#9B59B6)** — Database size
- **Green (#2ECC71)** — Performance/load time

### Layout
- Scrollable view with pull-to-refresh
- Grouped sections: Overview, Storage, Sync, Actions
- Cards with subtle borders and shadows
- UniversalHeader with back button + refresh icon

---

## Dependencies Used

### Hooks
- `useExperiences()` — Fetch all listings from Firestore
- `useAvailableActivities()` — Fetch activity categories
- `useAvailableLocations()` — Fetch location filters

### Components
- `UniversalHeader` — Top navigation bar
- `GradientBackground` — Theme-aware background gradient
- `TouchableOpacity` — Action buttons with haptics
- `RefreshControl` — Pull-to-refresh functionality

### Libraries
- `@expo/vector-icons` (Feather) — Icons
- `expo-haptics` — Tactile feedback
- `react-native-safe-area-context` — Safe area insets

---

## Migration to Web Dashboard

### Recommended Web Features

**Data Management**
- CRUD operations for listings (Create, Read, Update, Delete)
- Bulk import/export (CSV, JSON)
- Image upload & management
- Category/location management

**Analytics**
- User engagement metrics
- Popular listings tracking
- Search analytics
- Geographic distribution

**Content Moderation**
- Review and approve user-submitted content
- Report management (spam, inappropriate content)
- Content scheduling (publish/unpublish)

**System Administration**
- User role management
- API key configuration
- Backup & restore
- Database migration tools

**WordPress Integration**
- Auto-sync from dcgapp.com
- Webhook configuration
- Sync logs & error handling
- Field mapping configuration

### API Endpoints Needed

```
GET  /api/admin/stats         — Dashboard statistics
GET  /api/admin/listings      — All listings with filters
POST /api/admin/listings      — Create new listing
PUT  /api/admin/listings/:id  — Update listing
DEL  /api/admin/listings/:id  — Delete listing

GET  /api/admin/images        — Image library
POST /api/admin/images        — Upload image
DEL  /api/admin/images/:id    — Delete image

GET  /api/admin/sync          — Sync status
POST /api/admin/sync/trigger  — Manual sync trigger
```

---

## Related Files to Clean Up

When removing admin functionality, also check:

1. **Navigation**
   - `app/(drawer)/_layout.tsx` — Remove "Admin" drawer item
   - `src/components/modals/settings/SettingsModal.tsx` — Remove admin login flow

2. **Routes**
   - `app/(drawer)/admin.tsx` — Delete this file

3. **Hooks (keep for now, used elsewhere)**
   - `src/database/useListings.ts` — `useExperiences()`, `useAvailableActivities()`, etc.

4. **Assets**
   - No admin-specific images or assets to remove

---

## Screenshots / Design Reference

**Admin Hub Layout:**
- Header: "Admin Hub" with back arrow + refresh icon
- Section 1: System Overview (listings, categories, locations)
- Section 2: Storage & Performance (images, size, load time)
- Section 3: Synchronization (last sync timestamp)
- Section 4: Quick Actions (4 placeholder buttons)
- Footer: Info box explaining admin-only access

**Color Theme:**
- Dark mode: Cards with `rgba(255,255,255,0.05)` background
- Light mode: Cards with `rgba(0,0,0,0.02)` background
- Borders: Semi-transparent white/black
- Icons: Color-coded by metric type

---

## Notes for Future Implementation

1. **Authentication:** Web dashboard should have proper auth (not just password)
2. **Real-time Updates:** Consider WebSocket for live stat updates
3. **Audit Logging:** Track all admin actions (who, what, when)
4. **Permissions:** Role-based access control (admin, editor, viewer)
5. **Backup:** Automated daily backups before any destructive operations

---

**End of Admin Panel Documentation**
