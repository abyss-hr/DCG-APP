import React from "react";
import { View, StyleSheet, Switch, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme, typography } from "@/theme";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";

type Props = {
  icon: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  color?: string;
};

export default function SettingToggle({
  icon,
  title,
  description,
  value,
  onValueChange,
  color,
}: Props) {
  const { theme } = useTheme();
  const accent = color || theme.button;

  return (
    <View
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
    >
      {/* Left section */}
      <View style={styles.left}>
        {/* Icon bubble */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: accent + "20" },
          ]}
        >
          <Feather name={icon as any} size={20} color={accent} />
        </View>

        {/* Texts */}
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

      {/* Switch */}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: accent + "80" }}
        thumbColor={value ? accent : theme.subtitle}
        ios_backgroundColor={theme.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
