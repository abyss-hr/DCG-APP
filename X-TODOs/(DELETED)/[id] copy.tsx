// File: app/(drawer)/(listing)/[id].tsx

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Swiper from "react-native-swiper";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { fetchListingById } from "@/database/listingService";
import type { Listing } from "@/database/Listing";

import { useTheme } from "@/theme/ThemeProvider";
import { GradientBackground } from "@/theme/GradientBackground";
import UniversalHeader, { getHeaderHeights } from "@/components/ui/UniversalHeader";
import StaticMap from "@/components/maps/StaticMap";

const SCREEN_PADDING = 12;

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PADDING;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // LOAD LISTING
  // ----------------------------
  useEffect(() => {
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
        left={{ icon: "arrow-left", autoBack: true }}
      />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 90,
          paddingHorizontal: SCREEN_PADDING,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* IMAGES */}
        {images.length > 0 && (
          <View style={styles.gallery}>
            <Swiper>
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.image} />
              ))}
            </Swiper>
          </View>
        )}

        {/* TITLE */}
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

        {/* INFO */}
        <View style={styles.card}>
          <InfoRow label="Category" value={listing.categoryName} />
          <InfoRow label="Location" value={listing.locationMain} />
          {listing.locationSub && (
            <InfoRow label="Area" value={listing.locationSub} />
          )}
          {listing.priceLevel && (
            <InfoRow label="Price" value={listing.priceLevel} />
          )}
          {listing.workingPeriod && (
            <InfoRow label="Working period" value={listing.workingPeriod} />
          )}
        </View>

        {/* MAP */}
        {hasMap && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Location
            </Text>

            <StaticMap
              latitude={latitude}
              longitude={longitude}
              zoom={15}
              style={styles.map}
            />

            <TouchableOpacity
              style={[styles.mapBtn, { backgroundColor: theme.button }]}
              onPress={() => {
                const label = encodeURIComponent(listing.title);
                const url = Platform.select({
                  ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
                  android: `geo:0,0?q=${latitude},${longitude}(${label})`,
                });
                if (url) Linking.openURL(url);
              }}
            >
              <Feather name="navigation" size={18} color="#fff" />
              <Text style={styles.mapBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.ScrollView>

      {/* CONTACT BAR */}
      <View
        style={[
          styles.contactBar,
          {
            backgroundColor:
              theme.mode === "dark"
                ? "rgba(0,0,0,0.92)"
                : "rgba(255,255,255,0.92)",
          },
        ]}
      >
        {safePhone && (
          <ContactBtn
            icon="phone"
            label="Call"
            onPress={() => Linking.openURL(`tel:${safePhone}`)}
            color={theme.button}
          />
        )}
        {safeWhatsapp && (
          <ContactBtn
            icon="whatsapp"
            label="WhatsApp"
            onPress={() =>
              Linking.openURL(`https://wa.me/${safeWhatsapp}`)
            }
            color={theme.button}
            whatsapp
          />
        )}
        {listing.email && (
          <ContactBtn
            icon="mail"
            label="Email"
            onPress={() =>
              Linking.openURL(`mailto:${listing.email}`)
            }
            color={theme.button}
          />
        )}
      </View>
    </GradientBackground>
  );
}

/* ---------------------------------- */
/* COMPONENTS                         */
/* ---------------------------------- */

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 13, color: "#888" }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

function ContactBtn({
  icon,
  label,
  onPress,
  color,
  whatsapp,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
  whatsapp?: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.contactBtn}>
      {whatsapp ? (
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      ) : (
        <Feather name={icon} size={22} color={color} />
      )}
      <Text style={{ fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------------------------- */
/* STYLES                             */
/* ---------------------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  gallery: {
    height: 240,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: { width: "100%", height: 240 },

  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  description: { fontSize: 15, lineHeight: 22 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  badgeText: { fontSize: 13, fontWeight: "600" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 14 },

  map: { height: 160, borderRadius: 16, marginTop: 10 },

  mapBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  mapBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  contactBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "#ccc",
  },
  contactBtn: { alignItems: "center" },
});
