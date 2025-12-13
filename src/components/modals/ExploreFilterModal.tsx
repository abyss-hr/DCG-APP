// File: src/components/modals/ExploreFilterModal.tsx
// Filter modal for Explore page - categories, locations, nearby, with Featured activated by default

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
  Text,
} from "react-native";

import {
  Utensils,
  Wine,
  Waves,
  Footprints,
  Landmark,
  Trees,
  Mountain,
  Binoculars,
  Sparkles,
  HelpCircle,
  Star,
  X,
  SlidersHorizontal,
  Navigation,
  MapPin,
  Tags,
} from "lucide-react-native";

import * as Haptics from "expo-haptics";
import { ColorTheme } from "@/theme/colors";
import { typography } from "@/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export type ExploreFilterOptions = {
  categories: string[];
  places: string[];
  mode: "category" | "place";
  selectedCategories: string[];
  selectedPlaces: string[];
  nearMe: boolean;
  featuredOnly: boolean;
};

// ----- ICON MAP (auto detects based on category name) -----
const categoryIconMap: Record<string, any> = {
  food: Utensils,
  restaurant: Utensils,
  drinks: Wine,
  bar: Wine,
  beach: Waves,
  sea: Waves,
  bay: Waves,
  experience: Footprints,
  walk: Footprints,
  tour: Footprints,
  culture: Landmark,
  history: Landmark,
  historical: Landmark,
  nature: Trees,
  park: Trees,
  forest: Trees,
  adventure: Mountain,
  sport: Mountain,
  hiking: Mountain,
  sightseeing: Binoculars,
  city: Landmark,
  nightlife: Sparkles,
  default: HelpCircle,
};

// pick icon for category
function getCategoryIcon(label: string) {
  const key = label.toLowerCase();
  const found =
    Object.keys(categoryIconMap).find((k) => key.includes(k)) || "default";
  return categoryIconMap[found];
}

type Props = {
  visible: boolean;
  theme: ColorTheme;
  options: ExploreFilterOptions;
  onChange: (opts: ExploreFilterOptions) => void;
  onClose: () => void;
};

export default function ExploreFilterModal({
  visible,
  theme,
  options,
  onChange,
  onClose,
}: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const hasFilters =
    options.selectedCategories.length > 0 ||
    options.selectedPlaces.length > 0 ||
    options.nearMe ||
    options.featuredOnly;

  const slideUp = () => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideDown = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => cb?.());
  };

  useEffect(() => {
    if (visible) slideUp();
  }, [visible]);

  const resetAll = () => {
    Haptics.selectionAsync();
    onChange({
      ...options,
      selectedCategories: [],
      selectedPlaces: [],
      nearMe: false,
      featuredOnly: true, // Featured stays active on reset
    });
  };

  const toggleCategory = (cat: string) => {
    Haptics.selectionAsync();
    const exists = options.selectedCategories.includes(cat);
    onChange({
      ...options,
      selectedCategories: exists
        ? options.selectedCategories.filter((c) => c !== cat)
        : [...options.selectedCategories, cat],
    });
  };

  const togglePlace = (pl: string) => {
    Haptics.selectionAsync();
    const exists = options.selectedPlaces.includes(pl);
    onChange({
      ...options,
      selectedPlaces: exists
        ? options.selectedPlaces.filter((c) => c !== pl)
        : [...options.selectedPlaces, pl],
    });
  };

  const toggleMode = (mode: "category" | "place") =>
    onChange({ ...options, mode });

  const toggleNearMe = () =>
    onChange({ ...options, nearMe: !options.nearMe });

  const toggleFeatured = () =>
    onChange({ ...options, featuredOnly: !options.featuredOnly });

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none">
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, { opacity: fade }]}>
        <TouchableWithoutFeedback onPress={() => slideDown(onClose)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* SHEET */}
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
            <SlidersHorizontal size={18} color={theme.button} />
            <Text
              style={{
                marginLeft: 8,
                fontSize: 17,
                fontWeight: "700",
                color: theme.title,
              }}
            >
              Filters
            </Text>
          </View>

          {hasFilters && (
            <TouchableOpacity onPress={resetAll} style={styles.resetBtn}>
              <X size={18} color={theme.subtitle} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* MODE SWITCH */}
          <View style={styles.modeRow}>
            <TouchableOpacity
              onPress={() => toggleMode("category")}
              style={[
                styles.modeBtn,
                {
                  backgroundColor:
                    options.mode === "category"
                      ? theme.button
                      : theme.cardBackground,
                },
              ]}
            >
              <Tags
                size={16}
                color={options.mode === "category" ? "#fff" : theme.button}
              />
              <Text
                style={{
                  marginLeft: 6,
                  color: options.mode === "category" ? "#fff" : theme.text,
                  fontWeight: "600",
                }}
              >
                Category
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleMode("place")}
              style={[
                styles.modeBtn,
                {
                  backgroundColor:
                    options.mode === "place"
                      ? theme.button
                      : theme.cardBackground,
                },
              ]}
            >
              <MapPin
                size={16}
                color={options.mode === "place" ? "#fff" : theme.button}
              />
              <Text
                style={{
                  marginLeft: 6,
                  color: options.mode === "place" ? "#fff" : theme.text,
                  fontWeight: "600",
                }}
              >
                Place
              </Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORY / PLACE LIST */}
          <View style={{ marginTop: 10 }}>
            <Text
              style={{ color: theme.subtitle, marginBottom: 8, fontSize: typography.caption.fontSize }}
            >
              {options.mode === "category"
                ? "Select categories"
                : "Select places"}
            </Text>

            <View style={styles.chipsWrap}>
              {/* All chip */}
              <TouchableOpacity
                onPress={() =>
                  onChange({
                    ...options,
                    selectedCategories: [],
                    selectedPlaces: [],
                  })
                }
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      options.selectedCategories.length === 0 &&
                      options.selectedPlaces.length === 0
                        ? theme.button
                        : theme.cardBackground,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      options.selectedCategories.length === 0 &&
                      options.selectedPlaces.length === 0
                        ? "#fff"
                        : theme.text,
                  }}
                >
                  All
                </Text>
              </TouchableOpacity>

              {(options.mode === "category"
                ? options.categories
                : options.places
              ).map((label) => {
                const Icon =
                  options.mode === "category"
                    ? getCategoryIcon(label)
                    : MapPin;

                const isSel =
                  options.mode === "category"
                    ? options.selectedCategories.includes(label)
                    : options.selectedPlaces.includes(label);

                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() =>
                      options.mode === "category"
                        ? toggleCategory(label)
                        : togglePlace(label)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSel
                          ? theme.button
                          : theme.cardBackground,
                      },
                    ]}
                  >
                    <Icon
                      size={14}
                      color={isSel ? "#fff" : theme.text}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: isSel ? "#fff" : theme.text,
                        fontWeight: isSel ? "600" : "400",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* OPTIONS */}
          <View style={{ marginTop: 18 }}>
            <Text
              style={{ color: theme.subtitle, marginBottom: 8, fontSize: typography.caption.fontSize }}
            >
              Options
            </Text>

            <View style={styles.optionsRow}>
              {/* NEAR ME */}
              <TouchableOpacity
                onPress={toggleNearMe}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: options.nearMe
                      ? theme.button
                      : theme.cardBackground,
                  },
                ]}
              >
                <Navigation
                  size={16}
                  color={options.nearMe ? "#fff" : theme.text}
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
              </TouchableOpacity>

              {/* FEATURED - ACTIVE BY DEFAULT */}
              <TouchableOpacity
                onPress={toggleFeatured}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: options.featuredOnly
                      ? theme.button
                      : theme.cardBackground,
                  },
                ]}
              >
                <Star
                  size={16}
                  color={options.featuredOnly ? "#fff" : theme.text}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: options.featuredOnly ? "#fff" : theme.text,
                    fontWeight: options.featuredOnly ? "600" : "400",
                  }}
                >
                  Featured
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footerRow}>
          <TouchableOpacity
            onPress={resetAll}
            style={[
              styles.footerBtn,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Text style={{ textAlign: "center", color: theme.text }}>
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => slideDown(onClose)}
            style={[
              styles.footerBtn,
              { backgroundColor: theme.button },
            ]}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Apply
            </Text>
          </TouchableOpacity>
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
    maxHeight: SCREEN_HEIGHT * 0.78,
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
    marginBottom: 10,
  },
  resetBtn: {
    padding: 4,
    borderRadius: 20,
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    margin: 4,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
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
  },
});
