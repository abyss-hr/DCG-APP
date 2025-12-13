// src/components/ui/UniversalHeader.tsx
// 🧠 Displays a universal top header with animated scroll,
// theme toggle, left/right icons, and gradient background.

import React from "react";
import { Animated, Pressable, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme, typography } from "@/theme";
import type { ColorValue } from "react-native";

export const HEADER_BODY = 56;

export function getHeaderHeights(insetsTop: number) {
  const headerTotal = HEADER_BODY + insetsTop;
  return { headerTotal };
}

type IconName = React.ComponentProps<typeof Feather>["name"];

type LeftIcon =
  | {
      icon: IconName;
      onPress?: () => void;
      autoBack?: boolean;
    }
  | undefined;

type RightIcon =
  | { type?: "icon"; icon: IconName; onPress?: () => void; color?: ColorValue }
  | { type: "themeToggle" }
  | { type: "custom"; render: () => React.ReactNode };

type Props = {
  title: string;
  scrollY: Animated.Value;
  left?: LeftIcon;
  rightIcons?: RightIcon[];
};

export default function UniversalHeader({
  title,
  scrollY,
  left,
  rightIcons,
}: Props) {
  const navigation = useNavigation<any>();
  const { theme, effectiveMode, toggle } = useTheme();
  const insets = useSafeAreaInsets();

  const { headerTotal } = getHeaderHeights(insets.top);

  // Animation
  const translateY = scrollY.interpolate({
    inputRange: [0, headerTotal],
    outputRange: [0, -headerTotal],
    extrapolate: "clamp",
  });

  const doHaptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

  // System back button logic
  const canGoBack = navigation?.canGoBack?.() ?? false;

  // Theme gradients
  const gradientColors = theme.headerGradient as [ColorValue, ColorValue];
  const opacity = theme.headerOpacity ?? 1;

  // LEFT ICON
  const renderLeft =
    left && (!left.autoBack || canGoBack) ? (
      <Pressable
        hitSlop={8}
        style={styles.edgeBtn}
        onPress={() => {
          doHaptic();
          if (left.autoBack && canGoBack) navigation.goBack();
          else left.onPress?.();
        }}
      >
        <Feather name={left.icon} size={28} color={theme.headerIcon} />
      </Pressable>
    ) : (
      <View style={styles.edgeBtn} />
    );

  // RIGHT ICONS
  const renderRight = (
    <View style={styles.rightRow}>
      {(rightIcons || []).map((ri, idx) => {
        if (ri.type === "themeToggle")
          return (
            <Pressable
              key={`theme-${idx}`}
              style={styles.edgeBtn}
              onPress={() => {
                doHaptic();
                toggle();
              }}
            >
              <Feather
                name={effectiveMode === "dark" ? "sun" : "moon"}
                size={20}
                color={theme.headerIcon}
              />
            </Pressable>
          );

        if (ri.type === "custom")
          return (
            <View key={`custom-${idx}`} style={styles.edgeBtn}>
              {ri.render()}
            </View>
          );

        // Default: normal icon
        return (
          <Pressable
            key={`icon-${idx}`}
            style={styles.edgeBtn}
            onPress={() => {
              doHaptic();
              (ri as any).onPress?.();
            }}
          >
            <Feather
              name={(ri as any).icon}
              size={22}
              color={(ri as any).color || theme.headerIcon}
            />
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerTotal,
          paddingTop: insets.top,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity }]}
      />

      {/* Bottom divider */}
      <View
        style={{
          height: 1,
          backgroundColor:
            effectiveMode === "dark"
              ? "rgba(200, 200, 200, 0.15)"
              : "rgba(0,0,0,0.08)",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      {/* Header row */}
      <View style={styles.row}>
        {renderLeft}

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            color: theme.title,
            fontSize: 20,
            fontWeight: "700",
            lineHeight: typography.button.lineHeight,
          }}
        >
          {title}
        </Text>

        {renderRight}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    elevation: 4,
    justifyContent: "center",
  },
  row: {
    height: HEADER_BODY,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  edgeBtn: {
    padding: 8,
    minWidth: 36,
    alignItems: "center",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
