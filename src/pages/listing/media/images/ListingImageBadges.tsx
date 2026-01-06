// File: src/pages/listing/media/images/ListingImageBadges.tsx
// All image overlay badges - Featured, Popular, Seasonal, Price

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Award, Star, Calendar } from 'lucide-react-native';
import type { ImageBadgesProps } from '../../types';

export default function ListingImageBadges({
  featured,
  popular,
  seasonal,
  priceLevel,
}: ImageBadgesProps) {
  return (
    <>
      {/* Top-Left Corner - Featured & Popular */}
      <View style={styles.topLeft}>
        {/* Featured Badge */}
        {featured && (
          <View style={[styles.badge, styles.featuredBadge]}>
            <Award size={12} color="#fff" strokeWidth={2.5} />
            <Text style={styles.badgeText}>Featured</Text>
          </View>
        )}

        {/* Popular Badge */}
        {popular && (
          <View style={[styles.badge, styles.popularBadge]}>
            <Star size={12} color="#fff" strokeWidth={2.5} />
            <Text style={styles.badgeText}>Popular</Text>
          </View>
        )}
      </View>

      {/* Top-Right Corner - Seasonal */}
      {seasonal !== undefined && (
        <View style={styles.topRight}>
          <View style={[styles.badge, styles.seasonalBadge]}>
            <Calendar size={12} color="#fff" strokeWidth={2.5} />
            <Text style={styles.badgeText}>
              {seasonal ? 'Seasonal' : 'Year Round'}
            </Text>
          </View>
        </View>
      )}

      {/* Bottom-Left Corner - Price */}
      {priceLevel && (
        <View style={styles.bottomLeft}>
          <View style={[styles.badge, styles.priceBadge]}>
            <Text style={styles.priceText}>{priceLevel}</Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Positioning containers
  topLeft: {
    position: 'absolute',
    top: 6,
    left: 6,
    gap: 8,
    zIndex: 10,
  },
  topRight: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    zIndex: 10,
  },

  // Badge base style
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  // Badge variants
  featuredBadge: {
    backgroundColor: '#FFD700', // Gold
  },
  popularBadge: {
    backgroundColor: '#FF6B35', // Orange
  },
  seasonalBadge: {
    backgroundColor: '#4A90E2', // Blue
  },
  priceBadge: {
    backgroundColor: '#10B981', // Green
  },

  // Text styles
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
