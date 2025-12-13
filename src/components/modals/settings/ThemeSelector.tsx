import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

type ThemeMode = "system" | "light" | "dark";

type Props = {
  mode: ThemeMode;
  onChange: (m: ThemeMode) => void;
};

export default function ThemeSelector({ mode, onChange }: Props) {
  const { theme } = useTheme();

  const options: ThemeMode[] = ["system", "light", "dark"];

  const getIcon = (m: ThemeMode) => {
    switch (m) {
      case "system":
        return "smartphone";
      case "light":
        return "sun";
      case "dark":
        return "moon";
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option === mode;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              {
                backgroundColor: active
                  ? theme.button + "20"
                  : theme.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                borderColor: active
                  ? theme.button
                  : theme.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
                borderWidth: active ? 2 : 1,
              },
            ]}
            onPress={() => onChange(option)}
            activeOpacity={0.7}
          >
            <Feather
              name={getIcon(option) as any}
              size={24}
              color={active ? theme.button : theme.subtitle}
            />

            <Text
              style={[
                styles.label,
                {
                  color: active ? theme.button : theme.text,
                  fontWeight: active ? "600" : "400",
                },
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  option: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  label: {
    fontSize: typography.body.fontSize,
  },
});
