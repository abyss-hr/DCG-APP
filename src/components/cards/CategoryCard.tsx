// src/components/cards/CategoryCard.tsx
import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ColorTheme } from "@/theme/colors";
import { typography } from "@/theme";

type Props = {
  size?: "single" | "double";
  imageUrl: string;
  title: string;
  onPress: () => void;
  theme: ColorTheme;
};

export default function CategoryCard({
  size = "single",
  imageUrl,
  title,
  onPress,
  theme,
}: Props) {
  const imageStyle = size === "single" ? styles.single : styles.double;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <View style={styles.card}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Open ${title}`}
      >
        {/* Card Image */}
        <Image
          source={{ uri: imageUrl }}
          style={[imageStyle, { borderColor: theme.cardBorder }]}
        />

        {/* Text Badge Overlay */}
        <View style={styles.overlay}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.cardButtonBackground },
            ]}
          >
            <Feather name="map-pin" size={18} color={theme.cardButtonTitle} />

            <Text
              style={{
                marginLeft: 6,
                color: theme.cardButtonTitle,
                fontSize: typography.cardButton.fontSize,
                lineHeight: typography.cardButton.lineHeight,
                fontWeight: typography.cardButton.fontWeight,
              }}
            >
              {title}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 5,
  },

  single: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    borderWidth: 1,
    resizeMode: "cover",
  },

  double: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    borderWidth: 1,
    resizeMode: "cover",
  },

  overlay: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
});
