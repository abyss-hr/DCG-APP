// components/ui/SlowNetworkHint.tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeProvider";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type Props = {
  visible: boolean;
};

export default function SlowNetworkHint({ visible }: Props) {
  const { theme } = useTheme();
  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.box,
          {
            borderColor: theme.cardBorder,
            backgroundColor: theme.cardBackground,
          },
        ]}
      >
        <Feather name="wifi" size={16} color={theme.description} />

        <Text
          style={[
            styles.text,
            {
              color: theme.description,
              fontSize: typography.caption.fontSize,
              lineHeight: typography.caption.lineHeight,
            },
          ]}
        >
          Slow internet… still working on it.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },

  box: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    marginLeft: spacing.sm,
  },
});
