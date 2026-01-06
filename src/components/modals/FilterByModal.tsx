// File: src/components/modals/FilterByModal.tsx
// Animated bottom-sheet filter modal

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Easing,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ColorTheme } from "@/theme/colors";
import { typography } from "@/theme";
import TouchableHaptic from "@/components/ui/TouchableHaptic";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export type FilterByOptions = {
  categories: string[];
  selectedCategories: string[];
  nearMe: boolean;
  featuredOnly: boolean;
};

type Props = {
  visible: boolean;
  theme: ColorTheme;
  options: FilterByOptions;
  onApply: (opts: FilterByOptions) => void;
  onClose: () => void;
};

export default function FilterByModal({
  visible,
  theme,
  options,
  onApply,
  onClose,
}: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const hasFilters =
    options.selectedCategories.length > 0 ||
    options.nearMe ||
    options.featuredOnly;

  // 🟣 OPEN — smooth iOS slide-up (NO bounce)
  const openAnim = () => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔵 CLOSE — smooth slide-down
  const closeAnim = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => cb?.());
  };

  useEffect(() => {
    if (visible) openAnim();
  }, [visible]);

  // ───────── CATEGORY TOGGLE ─────────
  const toggleCategory = (cat: string) => {
    Haptics.selectionAsync().catch(() => {});
    const exists = options.selectedCategories.includes(cat);
    const next = exists
      ? options.selectedCategories.filter((c) => c !== cat)
      : [...options.selectedCategories, cat];
    onApply({ ...options, selectedCategories: next });
  };

  const toggleNearMe = () =>
    onApply({ ...options, nearMe: !options.nearMe });

  const toggleFeatured = () =>
    onApply({ ...options, featuredOnly: !options.featuredOnly });

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onApply({
      ...options,
      selectedCategories: [],
      nearMe: false,
      featuredOnly: false,
    });
  };

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    closeAnim(onClose);
  };

  if (!visible) return null;

  return (
    <Modal visible transparent statusBarTranslucent animationType="none">
      {/* BACKDROP */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: fade },
        ]}
      >
        <TouchableWithoutFeedback onPress={() => closeAnim(onClose)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.modalBackground ?? theme.background,
            borderColor: theme.border,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="sliders" size={18} color={theme.button} />
            <Text
              style={{
                marginLeft: 8,
                fontWeight: "700",
                fontSize: 17,
                color: theme.title,
              }}
            >
              Filter places
            </Text>
          </View>

          {hasFilters && (
            <TouchableHaptic onPress={handleReset} style={styles.headerResetBtn} haptic="light">
              <Feather name="x" size={18} color={theme.subtitle} />
              <Text style={{ color: theme.subtitle, marginLeft: 6 }}>
                Reset
              </Text>
            </TouchableHaptic>
          )}
        </View>

        {/* CONTENT */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* CATEGORY SECTION */}
          <View style={styles.section}>
            <Text
              style={{
                color: theme.subtitle,
                marginBottom: 6,
                letterSpacing: 0.5,
                fontSize: typography.caption.fontSize,
              }}
            >
              BY CATEGORY
            </Text>

            <View style={styles.chipsWrap}>
              {options.categories.map((cat) => {
                const sel = options.selectedCategories.includes(cat);
                return (
                  <TouchableHaptic
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: sel ? theme.button : theme.cardBackground,
                        borderColor: sel ? theme.button : theme.border,
                      },
                    ]}
                    haptic="light"
                  >
                    <Text
                      style={{
                        color: sel ? "#fff" : theme.text,
                        fontWeight: sel ? "600" : "400",
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableHaptic>
                );
              })}
            </View>
          </View>

          {/* OPTIONS */}
          <View style={styles.section}>
            <Text
              style={{
                color: theme.subtitle,
                marginBottom: 6,
                letterSpacing: 0.5,
                fontSize: typography.caption.fontSize,
              }}
            >
              OPTIONS
            </Text>

            <View style={styles.toggleRow}>
              {/* NEAR ME */}
              <TouchableHaptic
                onPress={toggleNearMe}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: options.nearMe
                      ? theme.button
                      : theme.cardBackground,
                    borderColor: options.nearMe ? theme.button : theme.border,
                  },
                ]}
                haptic="light"
              >
                <Feather
                  name="navigation"
                  size={16}
                  color={options.nearMe ? "#fff" : theme.button}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: options.nearMe ? "#fff" : theme.text,
                    fontWeight: options.nearMe ? "600" : "400",
                  }}
                >
                  Near Me
                </Text>
              </TouchableHaptic>

              {/* FEATURED ONLY */}
              <TouchableHaptic
                onPress={toggleFeatured}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: options.featuredOnly
                      ? theme.button
                      : theme.cardBackground,
                    borderColor: options.featuredOnly ? theme.button : theme.border,
                  },
                ]}
                haptic="light"
              >
                <Feather
                  name="star"
                  size={16}
                  color={options.featuredOnly ? "#fff" : theme.button}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: options.featuredOnly ? "#fff" : theme.text,
                    fontWeight: options.featuredOnly ? "600" : "400",
                  }}
                >
                  Featured only
                </Text>
              </TouchableHaptic>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footerRow}>
          <TouchableHaptic
            onPress={handleReset}
            style={[
              styles.footerBtn,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
            haptic="light"
          >
            <Text style={{ textAlign: "center", color: theme.subtitle }}>
              Reset
            </Text>
          </TouchableHaptic>

          <TouchableHaptic
            onPress={handleApply}
            style={[
              styles.footerBtn,
              { backgroundColor: theme.button, borderColor: theme.button },
            ]}
            haptic="medium"
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Apply filters
            </Text>
          </TouchableHaptic>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  headerResetBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 14,
  },

  section: {
    marginTop: 12,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    margin: 4,
  },

  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },

  toggleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },

  footerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  footerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
});
