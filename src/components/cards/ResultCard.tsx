import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

function ResultCardBase({ item, theme, onPress, distance }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme: fullTheme } = useTheme();
  const isFav = isFavorite(item.id);
  const pathname = usePathname();

  const images = useMemo(() => {
    if (Array.isArray(item.imageUrl)) return item.imageUrl.filter(Boolean);
    if (Array.isArray(item.imageUrls)) return item.imageUrls.filter(Boolean);
    return item.imageUrl ? [item.imageUrl] : [];
  }, [item.imageUrl, item.imageUrls]);

  const cover = images[0] ?? "";
  const hasImage = !!cover;

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
      imageUrl: cover ?? "",
      imageUrls: images,
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
              flexDirection: hasImage ? "row" : "column",
            },
          ]}
        >
          {hasImage && (
            <Image
              source={{ uri: cover }}
              style={styles.image}
              contentFit="cover"
              transition={120}
            />
          )}

          <View
            style={[
              styles.body,
              hasImage
                ? { minHeight: IMG }
                : { minHeight: undefined, paddingVertical: 12 },
            ]}
          >
            <View style={styles.titleRow}>
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

              <HeartButton
                filled={isFav}
                colorActive={theme.favorite}
                colorInactive="#9a9a9a"
                size={18}
                onToggle={onToggleFav}
              />
            </View>

            {!!item.description && (
              <Text
                numberOfLines={2}
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

            <View
              style={[
                hasImage ? styles.bottomRowAbs : styles.bottomRowFlow,
              ]}
            >
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
                  {distance &&
                  !distance.includes("NaN") &&
                  distance !== "0 km"
                    ? ` • ${distance}`
                    : ""}
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

export default memo(ResultCardBase);

const IMG = 120;

const styles = StyleSheet.create({
  cardContainer: { marginVertical: 6 },
  card: { borderRadius: 15, overflow: "hidden" },
  image: {
    width: IMG,
    height: IMG,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  body: { flex: 1, padding: 10 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  title: { flex: 1, flexShrink: 1 },
  desc: { marginTop: 6 },
  bottomRowAbs: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRowFlow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 4,
  },
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
});
