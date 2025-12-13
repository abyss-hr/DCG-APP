// src/components/ui/TitleWithButton.tsx
import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ColorTheme } from "@/theme/colors";
import { typography } from "@/theme";

type FeatherIcon = React.ComponentProps<typeof Feather>["name"];

type Props = {
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  iconName?: FeatherIcon;
  onPress?: () => void;
  theme: ColorTheme;
  rightAccessory?: React.ReactNode; // e.g. sun/moon toggle
};

export default function TitleWithButton({
  title,
  subtitle,
  buttonLabel = "Menu",
  iconName = "menu",
  onPress,
  theme,
  rightAccessory,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Subtitle */}
      {!!subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.subtitle,
              fontSize: typography.homeSubtitle.fontSize,
              lineHeight: typography.homeSubtitle.lineHeight,
              fontWeight: typography.homeSubtitle.fontWeight,
            },
          ]}
        >
          {subtitle}
        </Text>
      )}

      {/* Title + Buttons */}
      <View style={styles.row}>
        <Text
          style={{
            color: theme.title,
            fontSize: typography.homeTitle.fontSize,
            lineHeight: typography.homeTitle.lineHeight,
            fontWeight: typography.homeTitle.fontWeight,
          }}
        >
          {title}
        </Text>

        {/* Accessory row */}
        <View style={styles.rightRow}>
          {/* Example: sun/moon toggle passed from outside */}
          {rightAccessory}

          {/* Button (Menu / Settings / etc) */}
          {!!buttonLabel && (
            <Pressable
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={buttonLabel}
              style={[
                styles.btn,
                { borderColor: theme.buttonMenu, marginLeft: 8 },
              ]}
            >
              <Feather name={iconName} size={16} color={theme.buttonMenu} />

              <Text
                style={{
                  marginLeft: 6,
                  color: theme.buttonMenu,
                  fontSize: typography.button.fontSize,
                  lineHeight: typography.button.lineHeight,
                  fontWeight: typography.button.fontWeight,
                }}
              >
                {buttonLabel}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, paddingBottom: 2 },
  subtitle: { paddingLeft: 4, marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  rightRow: { flexDirection: "row", alignItems: "center" },
  btn: {
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
