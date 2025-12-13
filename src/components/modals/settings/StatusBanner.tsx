import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme, typography } from "@/theme";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";

type Props = {
  isOnline: boolean;
};

export default function StatusBanner({ isOnline }: Props) {
  const { theme } = useTheme();

  const bgColor = isOnline ? "#4CAF50" : "#FF6B6B";
  const icon = isOnline ? "wifi" : "wifi-off";
  const label = isOnline ? "Online" : "Offline";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Feather name={icon as any} size={18} color="#fff" />

      <Text
        style={[
          styles.label,
          {
            color: "#fff",
            fontSize: typography.body.fontSize,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  label: {
    letterSpacing: 0.3,
  },
});
