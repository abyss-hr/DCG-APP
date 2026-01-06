// File: src/pages/listing/types.ts
// TypeScript types for listing detail page components

import type { Listing } from '@/database/Listing';
import type { Animated, ViewStyle } from 'react-native';

/**
 * Header Component Props
 */
export interface ListingHeaderProps {
  title: string;
  listingId: string;
  scrollY: Animated.Value;
}

/**
 * Gallery Component Props
 */
export interface GalleryProps {
  images: string[];
  featured?: boolean;
  popular?: boolean;
  seasonal?: boolean;
  priceLevel?: string;
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

/**
 * Image Badges Props - All badges in one component
 */
export interface ImageBadgesProps {
  featured?: boolean;
  popular?: boolean;
  seasonal?: boolean;
  priceLevel?: string;
}

/**
 * Title Component Props
 */
export interface TitleProps {
  title: string;
  filterMainIcon?: string;
}

/**
 * Badge Component Props (Reusable)
 */
export interface BadgeProps {
  icon?: string;
  text: string;
  color?: string;
  variant?: 'featured' | 'popular' | 'new' | 'seasonal';
}

/**
 * Description Component Props
 */
export interface DescriptionProps {
  description: string;
  label?: string;
  maxLines?: number;
}

/**
 * Info Card Props
 */
export interface InfoCardProps {
  categoryName: string;
  locationMain: string;
  locationSub?: string;
  priceLevel?: string;
  workingPeriod?: string;
  onCategoryPress?: (category: string) => void;
}

/**
 * Map Section Props
 */
export interface MapSectionProps {
  latitude: number;
  longitude: number;
  title: string;
  onFullscreenPress?: () => void;
}

/**
 * Map Button Props
 */
export interface MapButtonProps {
  latitude: number;
  longitude: number;
  title: string;
}

/**
 * Contact Bar Props
 */
export interface ContactBarProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

/**
 * Social Links Props
 */
export interface SocialLinksProps {
  website?: string;
  facebook?: string;
  instagram?: string;
}

/**
 * Video Component Props
 */
export interface VideoProps {
  youtubeUrl: string;
}

/**
 * Tags Component Props
 */
export interface TagsProps {
  tags: string[];
  onTagPress?: (tag: string) => void;
}

/**
 * Card Wrapper Props
 */
export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  visible?: boolean;
}
