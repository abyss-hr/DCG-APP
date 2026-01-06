// Listing Detail Screen - Displays complete information for a single listing

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

// Database
import { fetchListingById } from "@/database/listingService";
import { fetchCategoryById, getFilterIcon } from "@/database/categoryService";
import type { Listing } from "@/database/Listing";
import type { Category } from "@/database/Category";

// Theme & UI
import { useTheme } from "@/theme/ThemeProvider";
import { GradientBackground } from "@/theme/GradientBackground";
import UniversalHeader, { getHeaderHeights } from "@/components/ui/UniversalHeader";
import TouchableHaptic from "@/components/ui/TouchableHaptic";

// Listing Components
import { 
  ListingGallery, 
  ListingTitle,
  ListingDescription,
  ListingInfoCard,
  ListingMapSection,
  ListingContactBar,
  ListingVideo,
  ListingSocialLinks,
} from "@/pages/listing";
import { NearbySimilarListings } from "@/pages/listing/similar/NearbySimilarListings";
import { ReportListingModal } from "@/components/modals/ReportListingModal";

const SCREEN_PADDING = 12;

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PADDING;

  // State
  const [listing, setListing] = useState<Listing | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  /* ============================================
     DATA LOADING
     ============================================ */
  useEffect(() => {
    setListing(null);
    setCategory(null);
    setLoading(true);

    let mounted = true;

    async function load() {
      try {
        if (!id) return;

        const data = await fetchListingById(String(id));
        if (!mounted) return;

        // Only show published listings
        if (!data || data.status !== "published") {
          setListing(null);
        } else {
          setListing(data);
          
          // Fetch category for filter icons
          if (data.categoryId) {
            const categoryData = await fetchCategoryById(data.categoryId);
            if (mounted) setCategory(categoryData);
          }
        }
      } catch (err) {
        console.error("Failed to load listing:", err);
        if (mounted) setListing(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* ============================================
     LOADING & ERROR STATES
     ============================================ */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.button} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Listing not available
        </Text>
      </View>
    );
  }

  /* ============================================
     DATA PREPARATION
     ============================================ */
  // Gallery images (featured + gallery combined)
  const images = Array.from(
    new Set([
      listing.featuredImageUrl,
      ...(listing.galleryImageUrls || []),
    ])
  ).filter(Boolean) as string[];

  // Map coordinates
  const coords =
    listing.coordinates
      ?.split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n)) || [];
  const latitude = coords[0];
  const longitude = coords[1];
  const hasMap = typeof latitude === "number" && typeof longitude === "number";

  // Contact info (sanitized)
  const safePhone = listing.phone?.replace(/[^\d+]/g, "") || "";
  const safeWhatsapp = listing.whatsapp?.replace(/[^\d]/g, "") || safePhone;

  // Filter icon for title
  const filterIcon = category && listing.filterMain
    ? getFilterIcon(category, listing.filterMain)
    : null;

  /* ============================================
     RENDER
     ============================================ */
  return (
    <GradientBackground>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      />

      {/* ==================== HEADER ==================== */}
      <UniversalHeader
        title={listing.title}
        scrollY={scrollY}
        left={{ icon: "back", autoBack: true }}
      />

      {/* ==================== CONTENT ==================== */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 10,
          paddingHorizontal: SCREEN_PADDING,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Image Gallery with Badges */}
        <ListingGallery
          images={images}
          featured={listing.featured}
          popular={listing.popular}
          priceLevel={listing.priceLevel}
          seasonal={listing.workingPeriod ? 
            listing.workingPeriod.toLowerCase().includes('seasonal') : 
            undefined
          }
        />

        {/* Title with Filter Icon */}
        <ListingTitle
          title={listing.title}
          filterMainIcon={filterIcon || undefined}
        />

        {/* Main Description */}
        <ListingDescription description={listing.description} maxLines={6} />

        {/* Featured Description (optional) */}
        {listing.descriptionFeatured && (
          <ListingDescription
            description={listing.descriptionFeatured}
            maxLines={3}
          />
        )}

        {/* Category, Location, Price, Hours */}
        <ListingInfoCard
          categoryName={listing.categoryName}
          locationMain={listing.locationMain}
          locationSub={listing.locationSub}
          priceLevel={listing.priceLevel}
          workingPeriod={listing.workingPeriod}
        />

        {/* Interactive Map (if coordinates available) */}
        {hasMap && (
          <ListingMapSection
            latitude={latitude}
            longitude={longitude}
            title={listing.title}
          />
        )}

        {/* YouTube Video (if available) */}
        {listing.youtubeUrl && (
          <ListingVideo youtubeUrl={listing.youtubeUrl} />
        )}

        {/* Social Links (Website, Facebook, Instagram) */}
        <ListingSocialLinks
          website={listing.website}
          facebook={listing.facebook}
          instagram={listing.instagram}
        />

        {/* Similar & Nearby Listings */}
        {hasMap && (
          <NearbySimilarListings
            currentListingId={listing.id}
            categoryId={listing.categoryId}
            categoryName={listing.categoryName}
            latitude={latitude}
            longitude={longitude}
            locationMain={listing.locationMain}
          />
        )}

        {/* Report Issue Link */}
        <TouchableHaptic
          style={{
            marginTop: 6,
            marginBottom: 6,
            paddingVertical: 8,
            alignItems: 'center',
          }}
          onPress={() => setReportModalVisible(true)}
          haptic="light"
        >
          <Text style={{ color: theme.subtitle, fontSize: 13, opacity: 0.6 }}>
            Report an issue
          </Text>
        </TouchableHaptic>
      </Animated.ScrollView>

      {/* ==================== FIXED BOTTOM BAR ==================== */}
      {/* Contact Actions: Phone, WhatsApp, Email */}
      <ListingContactBar
        phone={safePhone}
        whatsapp={safeWhatsapp}
        email={listing.email}
      />

      {/* ==================== MODALS ==================== */}
      {/* Report Issue Modal */}
      <ReportListingModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </GradientBackground>
  );
}

/* ============================================
   STYLES
   ============================================ */
const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
});
