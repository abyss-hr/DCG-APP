// File: app/(drawer)/(listing)/[id].tsx

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { fetchListingById } from "@/database/listingService";
import { fetchCategoryById, getFilterIcon, getExtraFilterIcon } from "@/database/categoryService";
import type { Listing } from "@/database/Listing";
import type { Category } from "@/database/Category";

import { useTheme } from "@/theme/ThemeProvider";
import { GradientBackground } from "@/theme/GradientBackground";
import UniversalHeader, { getHeaderHeights } from "@/components/ui/UniversalHeader";
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
import TouchableHaptic from "@/components/ui/TouchableHaptic";

const SCREEN_PADDING = 12;

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PADDING;

  const [listing, setListing] = useState<Listing | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // ----------------------------
  // LOAD LISTING
  // ----------------------------
  useEffect(() => {
    // Clear old data immediately when ID changes
    setListing(null);
    setCategory(null);
    setLoading(true);

    let mounted = true;

    async function load() {
      try {
        if (!id) return;

        const data = await fetchListingById(String(id));

        if (!mounted) return;

        // Enforce published only
        if (!data || data.status !== "published") {
          setListing(null);
        } else {
          setListing(data);
          
          // Fetch category to get filter icons
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

  // ----------------------------
  // STATES
  // ----------------------------
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

  // ----------------------------
  // IMAGES
  // ----------------------------
  const images = Array.from(
    new Set([
      listing.featuredImageUrl,
      ...(listing.galleryImageUrls || []),
    ])
  ).filter(Boolean) as string[];

  // ----------------------------
  // COORDINATES
  // ----------------------------
  const coords =
    listing.coordinates
      ?.split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n)) || [];

  const latitude = coords[0];
  const longitude = coords[1];
  const hasMap = typeof latitude === "number" && typeof longitude === "number";

  // ----------------------------
  // CONTACT HELPERS
  // ----------------------------
  const safePhone = listing.phone?.replace(/[^\d+]/g, "") || "";
  const safeWhatsapp =
    listing.whatsapp?.replace(/[^\d]/g, "") || safePhone;

  const openWebsite = () => {
    if (!listing.website) return;
    const url = listing.website.startsWith("http")
      ? listing.website
      : `https://${listing.website}`;
    Linking.openURL(url);
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <GradientBackground>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      />

      <UniversalHeader
        title={listing.title}
        scrollY={scrollY}
        left={{ icon: "back", autoBack: true }}
      />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPadTop,
          // paddingBottom: 70,
          paddingBottom: 10,
          paddingHorizontal: SCREEN_PADDING,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* NEW GALLERY COMPONENT */}
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

        {/* OLD GALLERY - COMMENTED OUT (was used for comparison)
        {images.length > 0 && (
          <View style={styles.gallery}>
            <Swiper>
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.image} />
              ))}
            </Swiper>
          </View>
        )}
        */}

        {/* TITLE */}
        {(() => {
          const filterIcon = category && listing.filterMain
            ? getFilterIcon(category, listing.filterMain)
            : null;
          return (
            <ListingTitle
              title={listing.title}
              filterMainIcon={filterIcon || undefined}
            />
          );
        })()}

        {/* OLD TITLE - COMMENTED OUT
        <View style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>
            {listing.title}
          </Text>

          {(listing.featured || listing.popular) && (
            <View style={styles.badge}>
              <Feather
                name={listing.featured ? "award" : "star"}
                size={14}
                color={theme.button}
              />
              <Text style={[styles.badgeText, { color: theme.button }]}>
                {listing.featured ? "Featured" : "Popular"}
              </Text>
            </View>
          )}

          <Text style={[styles.description, { color: theme.subtitle }]}>
            {listing.description}
          </Text>
        </View>
        */}

        {/* DESCRIPTION */}
        <ListingDescription description={listing.description} maxLines={6} />

        {/* FEATURED DESCRIPTION */}
        {listing.descriptionFeatured && (
          <ListingDescription
            description={listing.descriptionFeatured}
            maxLines={3}
          />
        )}

        {/* OLD DESCRIPTION - COMMENTED OUT
        <View style={styles.card}>
          <Text style={[styles.description, { color: theme.subtitle }]}>
            {listing.description}
          </Text>
        </View>
        */}

        {/* INFO */}
        <ListingInfoCard
          categoryName={listing.categoryName}
          locationMain={listing.locationMain}
          locationSub={listing.locationSub}
          priceLevel={listing.priceLevel}
          workingPeriod={listing.workingPeriod}
        />

        {/* MAP */}
        {hasMap && (
          <ListingMapSection
            latitude={latitude}
            longitude={longitude}
            title={listing.title}
          />
        )}

        {/* VIDEO */}
        {listing.youtubeUrl && (
          <ListingVideo youtubeUrl={listing.youtubeUrl} />
        )}

        {/* SOCIAL LINKS */}
        <ListingSocialLinks
          website={listing.website}
          facebook={listing.facebook}
          instagram={listing.instagram}
        />

        {/* NEARBY & SIMILAR LISTINGS */}
        {hasMap && (
          <NearbySimilarListings
            currentListingId={listing.id}
            categoryId={listing.categoryId}
            categoryName={listing.categoryName}
            latitude={latitude}
            longitude={longitude}
          />
        )}

        {/* REPORT ISSUE BUTTON */}
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

      {/* CONTACT BAR */}
      <ListingContactBar
        phone={safePhone}
        whatsapp={safeWhatsapp}
        email={listing.email}
      />

      {/* REPORT MODAL */}
      <ReportListingModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        listingId={listing.id}
        listingTitle={listing.title}
      />
    </GradientBackground>
  );
}

/* ---------------------------------- */
/* STYLES                             */
/* ---------------------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
