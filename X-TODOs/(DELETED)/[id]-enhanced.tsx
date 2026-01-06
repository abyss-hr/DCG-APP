// File: app/(drawer)/(listing)/[id]-enhanced.tsx
// Enhanced listing details page with all database fields and improved UI

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
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
import * as Haptics from "expo-haptics";

import { fetchListingById } from "@/database/listingService";
import type { Listing } from "@/database/Listing";

import { useTheme } from "@/theme/ThemeProvider";
import { GradientBackground } from "@/theme/GradientBackground";
import { typography } from "@/theme/typography";
import UniversalHeader, { getHeaderHeights } from "@/components/ui/UniversalHeader";
import StaticMap from "@/components/maps/StaticMap";

const SCREEN_PADDING = 16;

export default function EnhancedListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PADDING;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

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

        if (!data || data.status !== "published") {
          setListing(null);
        } else {
          setListing(data);
        }
      } catch (err) {
        console.error("[EnhancedListing] Failed to load:", err);
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
  // SHARE HANDLER
  // ----------------------------
  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Check out ${listing?.title || "this place"}!`,
        title: listing?.title || "Amazing Place",
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // ----------------------------
  // FAVORITE HANDLER
  // ----------------------------
  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFavorite(!isFavorite);
    // TODO: Persist to storage/database
  };

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.button} />
          <Text style={[styles.loadingText, { color: theme.subtitle }]}>
            Loading...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // ----------------------------
  // ERROR STATE
  // ----------------------------
  if (!listing) {
    return (
      <GradientBackground>
        <View style={styles.center}>
          <Feather name="alert-circle" size={48} color={theme.subtitle} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Listing Not Available
          </Text>
          <Text style={[styles.errorSubtitle, { color: theme.subtitle }]}>
            This listing may have been removed or is not published.
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // ----------------------------
  // DATA PROCESSING
  // ----------------------------
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
  const hasMap = typeof latitude === "number" && typeof longitude === "number";

  const safePhone = listing.phone?.replace(/[^\d+]/g, "") || "";
  const safeWhatsapp = listing.whatsapp?.replace(/[^\d]/g, "") || safePhone;

  // Extract YouTube video ID
  const youtubeId = listing.youtubeUrl
    ? extractYouTubeId(listing.youtubeUrl)
    : null;

  // Filter tags
  const filterTags = [listing.filterMain, listing.filterExtra]
    .filter(Boolean)
    .join(", ");

  // Use featured description if available and listing is featured
  const displayDescription =
    listing.featured && listing.descriptionFeatured
      ? listing.descriptionFeatured
      : listing.description;

  // Format dates
  const createdDate = listing.createdAt
    ? formatDate(listing.createdAt)
    : null;

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <GradientBackground>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      />

      <UniversalHeader
        title=""
        scrollY={scrollY}
        left={{ icon: "back", autoBack: true }}
        rightIcons={[
          {
            icon: isFavorite ? "heart" : "heart",
            onPress: handleFavorite,
            iconProps: {
              fill: isFavorite ? theme.button : "none",
              color: theme.button,
            },
          },
          { icon: "share", onPress: handleShare },
        ]}
      />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 100,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IMAGE GALLERY */}
        {images.length > 0 ? (
          <View style={styles.gallery}>
            <Swiper
              showsPagination
              dotStyle={styles.swiperDot}
              activeDotStyle={[styles.swiperDot, styles.swiperDotActive]}
              paginationStyle={{ bottom: 12 }}
            >
              {images.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </Swiper>
          </View>
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: theme.cardBackground }]}>
            <Feather name="image" size={48} color={theme.subtitle} />
            <Text style={{ color: theme.subtitle, marginTop: 8 }}>
              No images available
            </Text>
          </View>
        )}

        <View style={{ paddingHorizontal: SCREEN_PADDING }}>
          {/* TITLE CARD */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            {/* Badges */}
            <View style={styles.badgeRow}>
              {listing.featured && (
                <View style={[styles.badge, { backgroundColor: theme.button + "15" }]}>
                  <Feather name="award" size={14} color={theme.button} />
                  <Text style={[styles.badgeText, { color: theme.button }]}>
                    Featured
                  </Text>
                </View>
              )}
              {listing.popular && (
                <View style={[styles.badge, { backgroundColor: theme.button + "15" }]}>
                  <Feather name="star" size={14} color={theme.button} />
                  <Text style={[styles.badgeText, { color: theme.button }]}>
                    Popular
                  </Text>
                </View>
              )}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.text }]}>
              {listing.title}
            </Text>

            {/* Category & Location */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Feather name="tag" size={14} color={theme.subtitle} />
                <Text style={[styles.metaText, { color: theme.subtitle }]}>
                  {listing.categoryName}
                </Text>
              </View>
              {listing.locationMain && (
                <View style={styles.metaItem}>
                  <Feather name="map-pin" size={14} color={theme.subtitle} />
                  <Text style={[styles.metaText, { color: theme.subtitle }]}>
                    {listing.locationMain}
                    {listing.locationSub ? `, ${listing.locationSub}` : ""}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: theme.text }]}>
              {displayDescription}
            </Text>

            {/* Filter Tags */}
            {filterTags && (
              <View style={styles.tagsRow}>
                {[listing.filterMain, listing.filterExtra]
                  .filter(Boolean)
                  .map((tag, idx) => (
                    <View
                      key={idx}
                      style={[styles.tag, { backgroundColor: theme.cardBorder }]}
                    >
                      <Text style={[styles.tagText, { color: theme.subtitle }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* INFO CARD */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <SectionTitle theme={theme} icon="info" title="Details" />
            
            {listing.priceLevel && (
              <InfoRow
                icon="dollar-sign"
                label="Price Level"
                value={listing.priceLevel}
                theme={theme}
              />
            )}
            {listing.workingPeriod && (
              <InfoRow
                icon="clock"
                label="Working Hours"
                value={listing.workingPeriod}
                theme={theme}
              />
            )}
            {createdDate && (
              <InfoRow
                icon="calendar"
                label="Added"
                value={createdDate}
                theme={theme}
              />
            )}
          </View>

          {/* YOUTUBE VIDEO */}
          {youtubeId && (
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              <SectionTitle theme={theme} icon="video" title="Video Tour" />
              
              <Pressable
                style={[styles.videoThumbnail, { backgroundColor: theme.cardBorder }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(`https://www.youtube.com/watch?v=${youtubeId}`);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
                  }}
                  style={styles.videoThumbnailImage}
                  resizeMode="cover"
                />
                <View style={styles.playButton}>
                  <Feather name="play" size={32} color="#fff" />
                </View>
              </Pressable>
              
              <Text style={[styles.videoHint, { color: theme.subtitle }]}>
                Tap to watch on YouTube
              </Text>
            </View>
          )}

          {/* MAP SECTION */}
          {hasMap && (
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              <SectionTitle theme={theme} icon="map-pin" title="Location" />

              <StaticMap
                latitude={latitude}
                longitude={longitude}
                zoom={15}
                style={styles.map}
              />

              <View style={styles.mapButtonsRow}>
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

                {listing.googleMapUrl && (
                  <TouchableOpacity
                    style={[
                      styles.mapBtn,
                      styles.mapBtnSecondary,
                      { borderColor: theme.button },
                    ]}
                    onPress={() => Linking.openURL(listing.googleMapUrl)}
                  >
                    <MaterialCommunityIcons
                      name="google-maps"
                      size={18}
                      color={theme.button}
                    />
                    <Text style={[styles.mapBtnText, { color: theme.button }]}>
                      Google Maps
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* SOCIAL MEDIA & WEBSITE */}
          {(listing.website || listing.facebook || listing.instagram) && (
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              <SectionTitle theme={theme} icon="globe" title="Online" />

              <View style={styles.socialRow}>
                {listing.website && (
                  <SocialButton
                    icon="globe"
                    label="Website"
                    color={theme.button}
                    onPress={() => {
                      const url = listing.website!.startsWith("http")
                        ? listing.website!
                        : `https://${listing.website}`;
                      Linking.openURL(url);
                    }}
                  />
                )}
                {listing.facebook && (
                  <SocialButton
                    icon="facebook"
                    label="Facebook"
                    color="#1877F2"
                    onPress={() => {
                      const url = listing.facebook!.startsWith("http")
                        ? listing.facebook!
                        : `https://facebook.com/${listing.facebook}`;
                      Linking.openURL(url);
                    }}
                    isMaterial
                  />
                )}
                {listing.instagram && (
                  <SocialButton
                    icon="instagram"
                    label="Instagram"
                    color="#E4405F"
                    onPress={() => {
                      const url = listing.instagram!.startsWith("http")
                        ? listing.instagram!
                        : `https://instagram.com/${listing.instagram}`;
                      Linking.openURL(url);
                    }}
                    isMaterial
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* FLOATING CONTACT BAR */}
      {(safePhone || safeWhatsapp || listing.email) && (
        <View
          style={[
            styles.contactBar,
            {
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(0,0,0,0.95)"
                  : "rgba(255,255,255,0.95)",
              borderTopColor: theme.border,
            },
          ]}
        >
          {safePhone && (
            <ContactBtn
              icon="phone"
              label="Call"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`tel:${safePhone}`);
              }}
              color={theme.button}
            />
          )}
          {safeWhatsapp && (
            <ContactBtn
              icon="whatsapp"
              label="WhatsApp"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`https://wa.me/${safeWhatsapp}`);
              }}
              color="#25D366"
              whatsapp
            />
          )}
          {listing.email && (
            <ContactBtn
              icon="mail"
              label="Email"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL(`mailto:${listing.email}`);
              }}
              color={theme.button}
            />
          )}
        </View>
      )}
    </GradientBackground>
  );
}

/* ---------------------------------- */
/* HELPER COMPONENTS                  */
/* ---------------------------------- */

function SectionTitle({
  theme,
  icon,
  title,
}: {
  theme: any;
  icon: string;
  title: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Feather name={icon as any} size={20} color={theme.button} />
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Feather name={icon as any} size={16} color={theme.subtitle} />
        <Text style={[styles.infoLabelText, { color: theme.subtitle }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function SocialButton({
  icon,
  label,
  color,
  onPress,
  isMaterial,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  isMaterial?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.socialBtn, { backgroundColor: color + "15" }]}
    >
      {isMaterial ? (
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      ) : (
        <Feather name={icon as any} size={22} color={color} />
      )}
      <Text style={[styles.socialBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
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
        <MaterialCommunityIcons name={icon} size={26} color={color} />
      ) : (
        <Feather name={icon} size={24} color={color} />
      )}
      <Text style={[styles.contactBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------------------------------- */
/* HELPER FUNCTIONS                   */
/* ---------------------------------- */

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

function formatDate(timestamp: any): string {
  try {
    if (!timestamp) return "";
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

/* ---------------------------------- */
/* STYLES                             */
/* ---------------------------------- */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: typography.body.fontSize,
  },
  errorTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: typography.body.fontSize,
    textAlign: "center",
  },

  // Gallery
  gallery: {
    height: 280,
    width: "100%",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 280,
  },
  swiperDot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  swiperDotActive: {
    backgroundColor: "#fff",
    width: 24,
  },
  placeholderImage: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  // Cards
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Title Card
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    lineHeight: 32,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Section titles
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Info rows
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoLabelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  // Video
  videoThumbnail: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    marginBottom: 8,
  },
  videoThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -32 }, { translateY: -32 }],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoHint: {
    fontSize: 13,
    textAlign: "center",
  },

  // Map
  map: {
    height: 200,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  mapButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  mapBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  mapBtnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  mapBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // Social
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Contact bar
  contactBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 16,
  },
  contactBtn: {
    alignItems: "center",
    gap: 4,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
