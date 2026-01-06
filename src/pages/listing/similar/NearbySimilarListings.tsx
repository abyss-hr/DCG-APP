// NearbySimilarListings - Shows nearby listings and same category listings
import React, { useEffect, useState } from 'react';
import { MapPin, Compass } from 'lucide-react-native';
import { calculateDistance } from '@/utils/distanceUtils';
import { fetchListings, fetchListingsByCategory } from '@/database/listingService';
import { fetchCategoryById } from '@/database/categoryService';
import { ListingCarousel } from '@/components/cards/ListingCarousel';
import { useTheme } from '@/theme';
import type { Listing } from '@/database/Listing';
import type { Category } from '@/database/Category';

interface Props {
  currentListingId: string;
  categoryId: string;
  categoryName: string;
  latitude: number;
  longitude: number;
  locationMain?: string;
}

export function NearbySimilarListings({
  currentListingId,
  categoryId,
  categoryName,
  latitude,
  longitude,
  locationMain,
}: Props) {
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Map<string, Category>>(new Map());
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadListings();
  }, [currentListingId, categoryId]);

  const loadListings = async () => {
    try {
      setLoading(true);

      // Load all listings for nearby calculation
      const allListings = await fetchListings();

      // Parse current coordinates
      const currentCoords = { latitude, longitude };

      // Filter nearby listings (same location, within 10km, excluding current)
      const nearby = allListings
        .filter((listing) => {
          if (listing.id === currentListingId) return false;
          
          // Must be from same location
          if (locationMain && listing.locationMain !== locationMain) return false;
          
          // Parse coordinates from listing
          if (!listing.coordinates) return false;
          const [lat, lng] = listing.coordinates.split(',').map((s) => parseFloat(s.trim()));
          if (isNaN(lat) || isNaN(lng)) return false;

          // Calculate distance
          const distance = calculateDistance(currentCoords, { latitude: lat, longitude: lng });
          return distance <= 10000; // 10km in meters
        })
        .sort((a, b) => {
          // Sort by distance
          const [latA, lngA] = a.coordinates!.split(',').map((s) => parseFloat(s.trim()));
          const [latB, lngB] = b.coordinates!.split(',').map((s) => parseFloat(s.trim()));
          
          const distA = calculateDistance(currentCoords, { latitude: latA, longitude: lngA });
          const distB = calculateDistance(currentCoords, { latitude: latB, longitude: lngB });
          
          return distA - distB;
        })
        .slice(0, 10);

      setNearbyListings(nearby);

      // Load same category listings (excluding current)
      const similar = await fetchListingsByCategory(categoryId, currentListingId, 10);
      setSimilarListings(similar);

      // Load categories for all listings to get filter icons
      const allCategoryIds = new Set([
        ...nearby.map(l => l.categoryId),
        ...similar.map(l => l.categoryId),
      ]);

      const categoryMap = new Map<string, Category>();
      await Promise.all(
        Array.from(allCategoryIds).map(async (catId) => {
          const cat = await fetchCategoryById(catId);
          if (cat) categoryMap.set(catId, cat);
        })
      );
      setCategories(categoryMap);

    } catch (error) {
      console.error('Error loading similar listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {/* Nearby Places - Show only if 2+ listings from same location */}
      {nearbyListings.length >= 2 && (
        <ListingCarousel
          title={locationMain ? `Nearby in ${locationMain}` : "Nearby Places"}
          listings={nearbyListings}
          categories={categories}
          titleIcon={<MapPin size={22} color={theme.button} strokeWidth={1} />}
        />
      )}

      {/* More in Category - Show only if 3+ listings */}
      {similarListings.length >= 3 && (
        <ListingCarousel
          title="More to explore"
          listings={similarListings}
          categories={categories}
          titleIcon={<Compass size={22} color={theme.button} strokeWidth={1} />}
        />
      )}
    </>
  );
}
