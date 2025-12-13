// components/ui/SearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ColorTheme } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { radii } from "@/theme/radii";
import { typography } from "@/theme/typography";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  theme: ColorTheme;
  onSubmit?: () => void;
  onClear?: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search…",
  theme,
  onSubmit,
  onClear,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
    >
      {/* 🔍 Icon */}
      <Feather
        name="search"
        size={18}
        color={theme.subtitle}
        style={{ marginLeft: spacing.sm }}
      />

      {/* 📝 Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.subtitle}
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: typography.body.fontSize,
            lineHeight: typography.body.lineHeight,
            fontWeight: typography.body.fontWeight,
          },
        ]}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      {/* ❌ Clear button */}
      {value.length > 0 && (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          style={styles.clearButton}
        >
          <Feather name="x" size={18} color={theme.subtitle} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: radii.round, // FIXED
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: spacing.sm,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
