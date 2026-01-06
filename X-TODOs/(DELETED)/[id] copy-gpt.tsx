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

const SCREEN_PADDING = 14;

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const { headerTotal } = getHeaderHeights(insets.top);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (!id) return;
        const data = await fetchListingById(String(id));
        if (!mounted) return;
        if (!data || data.status !== "published") setListing(null);
        else setListing(data);
      } catch {
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
        <Text style={{ color: theme.text }}>Listing not available</Text>
      </View>
    );
  }

  /* ---------------- DATA ---------------- */
  const images = Array.from(
    new Set([
      listing.featuredImageUrl,
      ...(listing.galleryImageUrls || []),
    ])
  ).filter(Boolean) as string[];

  const coords =
    listing.coordinates
      ?.split(",")
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n)) || [];

  const latitude = coords[0];
  const longitude = coords[1];
  const hasMap = latitude && longitude;

  const safePhone = listing.phone?.replace(/[^\d+]/g, "") || "";
  const safeWhatsapp =
    listing.whatsapp?.replace(/[^\d]/g, "") || safePhone;

  const openUrl = (url?: string) => {
    if (!url) return;
    Linking.openURL(url.startsWith("http") ? url : `https://${url}`);
  };

  /* ---------------- RENDER ---------------- */
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
          paddingTop: headerTotal,
          paddingBottom: 110,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* ---------------- HERO ---------------- */}
        {images.length > 0 && (
          <View style={styles.hero}>
            <Swiper showsPagination>
              {images.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.heroImage} />
              ))}
            </Swiper>

            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>{listing.title}</Text>
              <Text style={styles.heroLocation}>
                {listing.locationMain}
                {listing.locationSub ? ` • ${listing.locationSub}` : ""}
              </Text>

              {(listing.featured || listing.popular) && (
                <View style={styles.heroBadge}>
                  <Feather
                    name={listing.featured ? "award" : "star"}
                    size={14}
                    color="#fff"
                  />
                  <Text style={styles.heroBadgeText}>
                    {listing.featured ? "Featured" : "Popular"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: SCREEN_PADDING }}>
          {/* ---------------- FEATURED DESC ---------------- */}
          {listing.descriptionFeatured && (
            <View style={styles.featuredBox}>
              <Text style={styles.featuredText}>
                {listing.descriptionFeatured}
              </Text>
            </View>
          )}

          {/* ---------------- TAGS ---------------- */}
          <View style={styles.tagRow}>
            {listing.filterMain && <Tag text={listing.filterMain} />}
            {listing.filterExtra && <Tag text={listing.filterExtra} />}
          </View>

          {/* ---------------- ABOUT ---------------- */}
          <Section title="About">
            <Text style={styles.bodyText}>{listing.description}</Text>
          </Section>

          {/* ---------------- INFO GRID ---------------- */}
          <Section title="Details">
            <View style={styles.infoGrid}>
              <InfoItem icon="grid" label="Category" value={listing.categoryName} />
              {listing.priceLevel && (
                <InfoItem icon="dollar-sign" label="Price" value={listing.priceLevel} />
              )}
              {listing.workingPeriod && (
                <InfoItem icon="clock" label="Period" value={listing.workingPeriod} />
              )}
            </View>
          </Section>

          {/* ---------------- VIDEO ---------------- */}
          {listing.youtubeUrl && (
            <Section title="Video">
              <TouchableOpacity
                style={styles.videoBtn}
                onPress={() => openUrl(listing.youtubeUrl)}
              >
                <Feather name="play-circle" size={20} color="#fff" />
                <Text style={styles.videoBtnText}>Watch Video</Text>
              </TouchableOpacity>
            </Section>
          )}

          {/* ---------------- MAP ---------------- */}
          {hasMap && (
            <Section title="Location">
              <StaticMap
                latitude={latitude}
                longitude={longitude}
                zoom={15}
                style={styles.map}
              />

              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() =>
                  openUrl(
                    Platform.select({
                      ios: `maps:0,0?q=${listing.title}@${latitude},${longitude}`,
                      android: `geo:0,0?q=${latitude},${longitude}`,
                    })
                  )
                }
              >
                <Feather name="navigation" size={18} color="#fff" />
                <Text style={styles.mapBtnText}>Open in Maps</Text>
              </TouchableOpacity>
            </Section>
          )}

          {/* ---------------- SOCIAL ---------------- */}
          {(listing.website ||
            listing.facebook ||
            listing.instagram) && (
            <Section title="Online">
              <View style={styles.socialRow}>
                {listing.website && (
                  <SocialBtn icon="globe" onPress={() => openUrl(listing.website)} />
                )}
                {listing.facebook && (
                  <SocialBtn icon="facebook" onPress={() => openUrl(listing.facebook)} />
                )}
                {listing.instagram && (
                  <SocialBtn icon="instagram" onPress={() => openUrl(listing.instagram)} />
                )}
              </View>
            </Section>
          )}
        </View>
      </Animated.ScrollView>

      {/* ---------------- CONTACT BAR ---------------- */}
      <View style={[styles.contactBar, { paddingBottom: insets.bottom }]}>
        {safePhone && (
          <ContactBtn icon="phone" label="Call" onPress={() => openUrl(`tel:${safePhone}`)} />
        )}
        {safeWhatsapp && (
          <ContactBtn
            icon="whatsapp"
            label="WhatsApp"
            whatsapp
            onPress={() => openUrl(`https://wa.me/${safeWhatsapp}`)}
          />
        )}
        {listing.email && (
          <ContactBtn
            icon="mail"
            label="Email"
            onPress={() => openUrl(`mailto:${listing.email}`)}
          />
        )}
      </View>
    </GradientBackground>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <View style={styles.infoItem}>
      <Feather name={icon} size={16} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SocialBtn({ icon, onPress }: any) {
  return (
    <TouchableOpacity style={styles.socialBtn} onPress={onPress}>
      <Feather name={icon} size={18} />
    </TouchableOpacity>
  );
}

function ContactBtn({ icon, label, onPress, whatsapp }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.contactBtn}>
      {whatsapp ? (
        <MaterialCommunityIcons name={icon} size={24} />
      ) : (
        <Feather name={icon} size={22} />
      )}
      <Text style={styles.contactText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  hero: { height: 300 },
  heroImage: { width: "100%", height: 300 },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  heroLocation: { fontSize: 14, color: "#ddd", marginTop: 2 },
  heroBadge: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  heroBadgeText: { color: "#fff", marginLeft: 6 },

  featuredBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  featuredText: { fontSize: 15, fontWeight: "600" },

  tagRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  tagText: { fontSize: 12 },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  bodyText: { fontSize: 15, lineHeight: 22 },

  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  infoItem: { width: "48%" },
  infoLabel: { fontSize: 12, opacity: 0.7 },
  infoValue: { fontSize: 15, fontWeight: "600" },

  videoBtn: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  videoBtnText: { color: "#fff", fontWeight: "600" },

  map: { height: 180, borderRadius: 16 },
  mapBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#000",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapBtnText: { color: "#fff", fontWeight: "600" },

  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    padding: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  contactBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  contactBtn: { alignItems: "center" },
  contactText: { fontSize: 12, marginTop: 4 },
});
