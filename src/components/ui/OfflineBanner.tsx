// components/ui/OfflineBanner.tsx
// Shows a banner when the app is offline (theme-aware)

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useOffline } from "@/components/context/OfflineContext";
import { useTheme, typography } from "@/theme";
import { spacing } from "@/theme/spacing";

export default function OfflineBanner() {
  const { isOnline, offlineEnabled, cachedListingsCount } = useOffline();
  const { theme } = useTheme();

  if (isOnline) return null;

  const msg =
    offlineEnabled && cachedListingsCount > 0
      ? `Offline Mode - Showing ${cachedListingsCount} cached listings`
      : "No Internet Connection";

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.error,
        },
      ]}
    >
      <Feather name="wifi-off" size={16} color="#fff" />

      <Text
        style={[
          styles.text,
          {
            color: "#fff",
            fontSize: typography.caption.fontSize,
            lineHeight: typography.caption.lineHeight,
            fontWeight: "600",
          },
        ]}
      >
        {msg}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    zIndex: 9999,
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  text: {
    fontWeight: "600",
  },
});
