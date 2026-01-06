// File: src/theme/icons.ts
// Description: Central icon configuration using Lucide React Native
// Import icons from theme for consistency across the app
// Updated: 14. prosinca 2025. - Initial creation

import * as LucideIcons from 'lucide-react-native';

/* ---------------------------------- */
/* ICON MAPPING SYSTEM                */
/* ---------------------------------- */

/**
 * Core app icons - used throughout the application
 * All icons from Lucide React Native for consistent SVG rendering
 */
export const AppIcons = {
  // Navigation & Header
  back: LucideIcons.ChevronLeft,
  close: LucideIcons.X,
  menu: LucideIcons.LayoutGrid,
  settings: LucideIcons.Settings,
  
  // Actions
  share: LucideIcons.Share2,
  heart: LucideIcons.Heart,
  heartFilled: LucideIcons.Heart, // Same icon, filled state via fill prop
  filter: LucideIcons.SlidersHorizontal,
  search: LucideIcons.Search,
  
  // Theme
  sun: LucideIcons.Sun,
  moon: LucideIcons.Moon,
  
  // Layout
//   grid: LucideIcons.LayoutGrid,
  grid: LucideIcons.ImagePlus,
  list: LucideIcons.LayoutList,
  zoomIn: LucideIcons.ZoomIn,       // NEW: Zoom in icon
  zoomOut: LucideIcons.ZoomOut,     // NEW: Zoom out icon
  
  // Map & Location
  map: LucideIcons.Map,
  mapPin: LucideIcons.MapPin,
  navigation: LucideIcons.Navigation,
  
  // Contact
  phone: LucideIcons.Phone,
  mail: LucideIcons.Mail,
  messageCircle: LucideIcons.MessageCircle,
  
  // Social Media
  facebook: LucideIcons.Facebook,
  instagram: LucideIcons.Instagram,
  globe: LucideIcons.Globe,
  
  // Media
  image: LucideIcons.Image,
  video: LucideIcons.Video,
  playCircle: LucideIcons.PlayCircle,
  
  // Status & Badges
  star: LucideIcons.Star,
  award: LucideIcons.Award,
  trophy: LucideIcons.Trophy,
  sparkles: LucideIcons.Sparkles,
  
  // Info & Utility
  info: LucideIcons.Info,
  alertCircle: LucideIcons.AlertCircle,
  checkCircle: LucideIcons.CheckCircle,
  clock: LucideIcons.Clock,
  calendar: LucideIcons.Calendar,
  dollarSign: LucideIcons.DollarSign,
  tag: LucideIcons.Tag,
  
  // Tabs (Home Navigation)
  home: LucideIcons.Home,
  house: LucideIcons.House,
  compass: LucideIcons.Compass,
  
  // Categories (for future database-driven icons)
  utensils: LucideIcons.Utensils,      // Food & Drink
  fish: LucideIcons.Fish,              // Traditional/Seafood
  wine: LucideIcons.Wine,              // Bars & Nightlife
  waves: LucideIcons.Waves,            // Beaches & Sea
  trees: LucideIcons.Trees,            // Nature & Parks
  mountain: LucideIcons.Mountain,      // Adventure & Sports
  landmark: LucideIcons.Landmark,      // Culture & History
  binoculars: LucideIcons.Binoculars,  // Sightseeing
  footprints: LucideIcons.Footprints,  // Tours & Experiences
} as const;

/* ---------------------------------- */
/* LEGACY: HARDCODED CATEGORY MAPPING */
/* Not used anymore - icons come from Firebase */
/* ---------------------------------- */

// export const CategoryIcons: Record<string, keyof typeof AppIcons> = {
//   'Food & Drink': 'utensils',
//   'Restaurant': 'utensils',
//   // ... etc - REMOVED
// };

// export function getCategoryIcon(categoryName: string): keyof typeof AppIcons {
//   return CategoryIcons[categoryName] || 'tag';
// }

/* ---------------------------------- */
/* HELPER FUNCTIONS                   */
/* ---------------------------------- */

/**
 * Get icon component by name
 * Type-safe way to access icons
 */
export function getIcon(iconName: keyof typeof AppIcons) {
  return AppIcons[iconName];
}

/**
 * Get Lucide icon dynamically from string name (e.g., from Firebase)
 * Supports PascalCase icon names like "KeySquare", "Route", "Kayak", "Fish"
 * Returns null if icon not found (no fallback)
 */
export function getLucideIcon(iconName?: string) {
  if (!iconName) return null;
  
  // Direct access to Lucide icon by name
  const Icon = (LucideIcons as any)[iconName];
  
  // Return icon or null (no fallback)
  return Icon || null;
}

/* ---------------------------------- */
/* TYPE EXPORTS                       */
/* ---------------------------------- */

export type IconName = keyof typeof AppIcons;
