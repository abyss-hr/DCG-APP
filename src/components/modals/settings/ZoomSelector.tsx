import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

export type ZoomMode = "grid" | "list";

type Props = {
  zoomMode: ZoomMode;
  onChange: (mode: ZoomMode) => void;
};

export default function ZoomSelector({ zoomMode, onChange }: Props) {
  const { theme } = useTheme();

  const options: ZoomMode[] = ["list", "grid"];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option === zoomMode;
        const icon = option === "list" ? "list" : "grid";
        const label = option === "list" ? "List" : "Zoomed";

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
              name={icon as any}
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
              {label}
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
