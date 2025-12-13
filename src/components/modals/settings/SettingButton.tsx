import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

type Props = {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void;
  color?: string;
  rightText?: string;
};

export default function SettingButton({
  icon,
  title,
  description,
  rightText,
  onPress,
  color,
}: Props) {
  const { theme } = useTheme();
  const accent = color || theme.button;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor:
            theme.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
          borderColor:
            theme.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.08)",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left side */}
      <View style={styles.left}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: accent + "20" },
          ]}
        >
          <Feather name={icon as any} size={20} color={accent} />
        </View>

        {/* Labels */}
        <View style={styles.texts}>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
          >
            {title}
          </Text>

          {description && (
            <Text
              style={[
                styles.description,
                { color: theme.subtitle },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>

      {/* Right side */}
      <View style={styles.right}>
        {rightText && (
          <Text
            style={[
              styles.rightText,
              { color: theme.subtitle },
            ]}
          >
            {rightText}
          </Text>
        )}

        <Feather name="chevron-right" size={20} color={theme.subtitle} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.round,
    alignItems: "center",
    justifyContent: "center",
  },

  texts: {
    flex: 1,
    gap: spacing.xs,
  },

  title: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },

  description: {
    fontSize: typography.caption.fontSize,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  rightText: {
    fontSize: typography.caption.fontSize,
  },
});
