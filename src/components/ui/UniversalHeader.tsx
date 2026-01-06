// src/components/ui/UniversalHeader.tsx
// 🧠 Displays a universal top header with animated scroll,
// theme toggle, left/right icons, and gradient background.
// Updated: 14. prosinca 2025. - Migrated from Feather to Lucide icons

import React from "react";
import { Animated, Pressable, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme, typography, AppIcons, type IconName } from "@/theme";
import type { ColorValue } from "react-native";

export const HEADER_BODY = 56;

export function getHeaderHeights(insetsTop: number) {
  const headerTotal = HEADER_BODY + insetsTop;
  return { headerTotal };
}

type LeftIcon =
  | {
      icon: IconName;
      onPress?: () => void;
      autoBack?: boolean;
    }
  | undefined;

type RightIcon =
  | { type?: "icon"; icon: IconName; onPress?: () => void; color?: ColorValue; iconProps?: any }
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
  const LeftIcon = left && (!left.autoBack || canGoBack) ? AppIcons[left.icon] : null;
  
  const renderLeft = LeftIcon ? (
    <Pressable
      hitSlop={8}
      style={styles.edgeBtn}
      onPress={() => {
        doHaptic();
        if (left?.autoBack && canGoBack) navigation.goBack();
        else left?.onPress?.();
      }}
    >
      <LeftIcon size={28} color={theme.headerIcon} />
    </Pressable>
  ) : (
    <View style={styles.edgeBtn} />
  );

  // RIGHT ICONS
  const renderRight = (
    <View style={styles.rightRow}>
      {(rightIcons || []).map((ri, idx) => {
        if (ri.type === "themeToggle") {
          const ThemeIcon = effectiveMode === "dark" ? AppIcons.sun : AppIcons.moon;
          return (
            <Pressable
              key={`theme-${idx}`}
              style={styles.edgeBtn}
              onPress={() => {
                doHaptic();
                toggle();
              }}
            >
              <ThemeIcon size={20} color={theme.headerIcon} />
            </Pressable>
          );
        }

        if (ri.type === "custom")
          return (
            <View key={`custom-${idx}`} style={styles.edgeBtn}>
              {ri.render()}
            </View>
          );

        // Default: normal icon (type === "icon" or undefined)
        const iconData = ri as { icon: IconName; onPress?: () => void; color?: ColorValue; iconProps?: any };
        const IconComponent = AppIcons[iconData.icon];
        
        if (!IconComponent) {
          console.warn(`Icon "${iconData.icon}" not found in AppIcons`);
          return null;
        }
        
        return (
          <Pressable
            key={`icon-${idx}`}
            style={styles.edgeBtn}
            onPress={() => {
              doHaptic();
              iconData.onPress?.();
            }}
          >
            <IconComponent
              size={22}
              color={iconData.color || theme.headerIcon}
              {...iconData.iconProps}
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
    paddingHorizontal: 2,  // Changed from 12 to 2 (10px closer)
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
