// ListingCard component matching Brikk theme design
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TouchableHaptic from '@/components/ui/TouchableHaptic';
import type { Listing } from '../../database/Listing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16; // 16px margin on each side
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2); // Total card width

interface Props {
  listing: Listing;
  onPress: () => void;
  showBadge?: boolean;
}

export function ListingCard({ listing, onPress, showBadge = true }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const description = typeof listing.description === 'string' 
    ? JSON.parse(listing.description) 
    : listing.description;
  const location = description.location || {};
  const galleryUrls = description.media?.galleryUrls || description.media?.images || [];
  const featuredImage = description.media?.featuredImageUrl || description.media?.imageUrl || galleryUrls[0] || '';
  const allImages = featuredImage ? [featuredImage, ...galleryUrls.filter((img: string) => img !== featuredImage)] : galleryUrls;
  
  const isPromoted = description.business?.isPromoted || false;
  const category = location.category || '';
  const region = location.region || location.city || location.place || '';  // Show region (e.g., "Šipan")

  // Determine badge text based on promoted status and category
  const badgeText = isPromoted ? 'Must visit' : category || 'Experience';
  const badgeColor = isPromoted ? '#FFD700' : '#00A896';

  return (
    <TouchableHaptic style={styles.card} onPress={onPress} haptic="light">
      {/* Image Gallery with horizontal scroll */}
      <View style={styles.imageContainer}>
        {allImages.length > 0 ? (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / CARD_WIDTH
                );
                setCurrentImageIndex(index);
              }}
              style={styles.imageScroll}
            >
              {allImages.map((imageUrl: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image counter badge */}
            {allImages.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{allImages.length}
                </Text>
              </View>
            )}

            {/* Category/Status badge */}
            {showBadge && badgeText && (
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </>
        ) : (
          // Placeholder when no image
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={48} color="#CCC" />
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        {/* Short description */}
        {description.content && (
          <Text style={styles.description} numberOfLines={2}>
            {description.content.replace(/<[^>]*>/g, '').trim()}
          </Text>
        )}

        {/* Meta info row */}
        <View style={styles.metaRow}>
          {/* Location - Show region (island/area) */}
          {region && (
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#00A896" />
              <Text style={styles.metaText} numberOfLines={1}>
                {region}
              </Text>
            </View>
          )}

          {/* Category */}
          {category && (
            <View style={styles.metaItem}>
              <Ionicons name="pricetag" size={14} color="#666" />
              <Text style={styles.categoryText} numberOfLines={1}>
                {category}
              </Text>
            </View>
          )}
        </View>

        {/* Contact icons row */}
        {(description.contact?.phone || description.contact?.website) && (
          <View style={styles.contactRow}>
            {description.contact.phone && (
              <View style={styles.contactIcon}>
                <Ionicons name="call" size={16} color="#00A896" />
              </View>
            )}
            {description.contact.website && (
              <View style={styles.contactIcon}>
                <Ionicons name="globe" size={16} color="#00A896" />
              </View>
            )}
            {description.contact.email && (
              <View style={styles.contactIcon}>
                <Ionicons name="mail" size={16} color="#00A896" />
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableHaptic>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  imageScroll: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: CARD_WIDTH,
    height: 220,
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    maxWidth: '45%',
  },
  metaText: {
    fontSize: 14,
    color: '#00A896',
    marginLeft: 4,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
