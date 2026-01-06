// CompactListingCard - Smaller card for horizontal carousels with overlay design
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Award, Star, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, getLucideIcon } from '@/theme';
import TouchableHaptic from '@/components/ui/TouchableHaptic';
import type { Listing } from '../../database/Listing';

interface Props {
  listing: Listing;
  onPress: () => void;
  width?: number;
  filterIcon?: string;
}

export function CompactListingCard({ listing, onPress, width = 280, filterIcon }: Props) {
  const { theme } = useTheme();
  
  // Firebase structure - data is already flattened
  const featuredImage = listing.featuredImageUrl || listing.galleryImageUrls?.[0] || '';
  const isSeasonal = listing.workingPeriod?.toLowerCase().includes('seasonal');

  // Get Lucide icon from string (same as ListingTitle)
  const FilterIcon = filterIcon ? getLucideIcon(filterIcon) : null;

  return (
    <TouchableHaptic 
      style={[
        styles.card, 
        { 
          width, 
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        }
      ]} 
      onPress={onPress} 
      haptic="light"
    >
      {/* Image with overlays */}
      <View style={styles.imageContainer}>
        {featuredImage ? (
          <Image
            source={{ uri: featuredImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={40} color="#CCC" />
          </View>
        )}

        {/* Top badges - Featured, Popular, Seasonal, Price */}
        <View style={styles.topBadges}>
          {listing.featured && (
            <View style={[styles.badge, styles.featuredBadge]}>
              <Award size={12} color="#fff" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Featured</Text>
            </View>
          )}
          {listing.popular && (
            <View style={[styles.badge, styles.popularBadge]}>
              <Star size={12} color="#fff" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Popular</Text>
            </View>
          )}
          {isSeasonal && (
            <View style={[styles.badge, styles.seasonalBadge]}>
              <Calendar size={12} color="#fff" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Seasonal</Text>
            </View>
          )}
          {listing.priceLevel && (
            <View style={[styles.badge, styles.priceBadge]}>
              <Text style={styles.priceText}>{listing.priceLevel}</Text>
            </View>
          )}
        </View>

        {/* Bottom gradient overlay with title */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {listing.title}
            </Text>
            {FilterIcon && (
              <FilterIcon 
                size={22} 
                color="#fff" 
                strokeWidth={2}
              />
            )}
          </View>
        </LinearGradient>
      </View>
    </TouchableHaptic>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBadges: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    maxWidth: '90%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredBadge: {
    backgroundColor: '#FFD700',
  },
  popularBadge: {
    backgroundColor: '#FF6B35',
  },
  seasonalBadge: {
    backgroundColor: '#4A90E2',
  },
  priceBadge: {
    backgroundColor: '#10B981',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priceText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
