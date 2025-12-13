import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { memo, useMemo } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFavorites } from "@/components/context/FavoritesContext";
import HeartButton from "@/components/ui/HeartButton";
import type { ResultCardItem } from "@/database/listingAdapter";
import { typography, useTheme } from "@/theme";
import { ColorTheme } from "@/theme/colors";

type Props = {
  item: ResultCardItem;
  theme: ColorTheme;
  onPress?: () => void;
  distance?: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_PADDING = 0;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING;
const IMG_H = 210;

function ResultCardZoomBase({ item, theme, onPress, distance }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme: fullTheme } = useTheme();
  const isFav = isFavorite(item.id);
  const pathname = usePathname();

  const imgs = useMemo(() => {
    if (Array.isArray(item.imageUrl)) return item.imageUrl.filter(Boolean);
    if (Array.isArray(item.imageUrls)) return item.imageUrls.filter(Boolean);
    return item.imageUrl ? [item.imageUrl] : [];
  }, [item.imageUrl, item.imageUrls]);

  const hasImage = imgs.length > 0;
  const cover = imgs[0] ?? "";
  const locationText = item.location || (item as any)?.place || "";

  const goToDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (onPress) onPress();
    else router.push(`/(drawer)/(listing)/${item.id}` as any);
  };

  const onToggleFav = () => {
    toggleFavorite({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: cover,
      imageUrls: imgs,
      location: item.location,
      category: item.category,
      isPromo: item.isPromo,
      place: (item as any)?.place,
    } as any);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable onPress={goToDetails} android_ripple={{ color: "#00000010" }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.transparent,
              borderColor: theme.border,
              borderWidth: item.isPromo ? 2 : 1,
            },
          ]}
        >
          <View style={styles.heartWrap}>
            <HeartButton
              filled={isFav}
              colorActive={theme.favorite}
              colorInactive="#9a9a9a"
              size={18}
              onToggle={onToggleFav}
            />
          </View>

          {hasImage && (
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: cover }}
                style={{ width: CARD_WIDTH, height: IMG_H }}
                contentFit="cover"
                transition={120}
                cachePolicy="memory-disk"
              />

              {imgs.length > 1 && (
                <View style={styles.imageCount}>
                  <Feather name="image" size={14} color="#fff" />
                  <Text style={styles.imageCountText}>+{imgs.length - 1}</Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.content}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.title,
                {
                  color: theme.title,
                  fontSize: typography.title.fontSize,
                  fontWeight: typography.title.fontWeight,
                  lineHeight: typography.title.lineHeight,
                },
              ]}
            >
              {item.title}
            </Text>

            {!!item.description && (
              <Text
                numberOfLines={3}
                style={[
                  styles.desc,
                  {
                    color: theme.description,
                    fontSize: typography.body.fontSize,
                    lineHeight: typography.body.lineHeight,
                  },
                ]}
              >
                {item.description}
              </Text>
            )}

            <View style={styles.bottomRow}>
              <View style={styles.locRow}>
                <Feather name="map-pin" size={12} color={theme.location} />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.locText,
                    {
                      color: theme.location,
                      fontSize: typography.caption.fontSize,
                      lineHeight: typography.caption.lineHeight,
                    },
                  ]}
                >
                  {locationText}
                  {distance ? ` • ${distance}` : ""}
                </Text>
              </View>

              {item.isPromo && (
                <View
                  style={[
                    styles.featuredTag,
                    { backgroundColor: theme.button },
                  ]}
                >
                  <Text style={styles.featuredText}>FEATURED</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default memo(ResultCardZoomBase);

const styles = StyleSheet.create({
  cardContainer: { marginVertical: 6 },
  card: { borderRadius: 15, overflow: "hidden" },
  imageWrap: {
    position: "relative",
    overflow: "hidden",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartWrap: {
    position: "absolute",
    right: 4,
    top: 4,
    zIndex: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  content: { padding: 10 },
  title: {},
  desc: { marginTop: 6 },
  bottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: {},
  featuredTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  imageCount: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
