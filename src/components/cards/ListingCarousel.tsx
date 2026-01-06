// ListingCarousel - Horizontal scrolling carousel for listings
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { getFilterIcon } from '@/database/categoryService';
import { CompactListingCard } from './CompactListingCard';
import type { Listing } from '@/database/Listing';
import type { Category } from '@/database/Category';

interface Props {
  title: string;
  listings: Listing[];
  categories?: Map<string, Category>;
  cardWidth?: number;
  titleIcon?: React.ReactNode;
}

export function ListingCarousel({ title, listings, categories, cardWidth = 280, titleIcon }: Props) {
  const { theme } = useTheme();
  const router = useRouter();

  if (!listings || listings.length === 0) return null;

  const handleCardPress = (listingId: string) => {
    router.push(`/(drawer)/(listing)/${listingId}`);
  };

  // Get filter icon for a listing
  const getListingIcon = (listing: Listing): string | undefined => {
    const category = categories?.get(listing.categoryId);
    if (category && listing.filterMain) {
      return getFilterIcon(category, listing.filterMain) || undefined;
    }
    return listing.filterMainIcon || listing.categoryIcon || undefined;
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.titleContainer}>
        {titleIcon && <View style={styles.titleIcon}>{titleIcon}</View>}
        <Text style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={cardWidth + 12}
        decelerationRate="fast"
      >
        {listings.map((listing, index) => (
          <View 
            key={listing.id} 
            style={[
              styles.cardWrapper,
              index === 0 && styles.firstCard,
              index === listings.length - 1 && styles.lastCard,
            ]}
          >
            <CompactListingCard
              listing={listing}
              onPress={() => handleCardPress(listing.id)}
              width={cardWidth}
              filterIcon={getListingIcon(listing)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingRight: 0,
  },
  cardWrapper: {
    marginLeft: 12,
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: 0,
  },
});
