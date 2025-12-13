import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { LayoutGrid, LayoutList, SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ResultCard from "@/components/cards/ResultCard";
import ResultCardZoom from "@/components/cards/ResultCardZoom";
import { useLocation } from "@/components/context/LocationContext";
import { useZoom } from "@/components/context/ZoomContext";

import SearchFilterModal, {
  SearchFilterOptions,
} from "@/components/modals/SearchFilterModal";
import SettingsModal from "@/components/modals/settings/SettingsModal";

import SearchBar from "@/components/ui/SearchBar";
import SlowNetworkHint from "@/components/ui/SlowNetworkHint";
import UniversalHeader, {
  getHeaderHeights,
} from "@/components/ui/UniversalHeader";

import { GradientBackground, typography, useTheme } from "@/theme";

import {
  calculateDistance,
  formatDistance,
  parseCoordinates,
} from "@/utils/distanceUtils";

import type { ResultCardItem } from "@/database/listingAdapter";
import { useListings } from "@/database/useListings";

function shuffleOnce<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SCREEN_PAD = 12;
type ItemWithDistance = ResultCardItem & { distance?: number };

export default function SearchScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const scrollY = useRef(new Animated.Value(0)).current;
  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PAD;

  // ************* NEW DATABASE HOOK *************
  const { data: items = [], loading, refetch } = useListings();

  const { userLocation } = useLocation();
  const { zoomMode, toggleZoom } = useZoom();

  const [categories, setCategories] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);

  useEffect(() => {
    const sCats = new Set<string>();
    const sPlaces = new Set<string>();

    for (const it of items as ResultCardItem[]) {
      if (it.category) sCats.add(String(it.category));

      const label =
        (it.location as string) ||
        (it.place as string) ||
        "";
      if (label) sPlaces.add(label);
    }

    setCategories(Array.from(sCats));
    setPlaces(Array.from(sPlaces));
  }, [items]);

  const [randomizedItems, setRandomizedItems] = useState<ResultCardItem[]>([]);

  useEffect(() => {
    setRandomizedItems(shuffleOnce(items as ResultCardItem[]));
  }, [items]);

  const [query, setQuery] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState<SearchFilterOptions>({
    categories: [],
    places: [],
    mode: "category",
    selectedCategories: [],
    selectedPlaces: [],
    nearMe: false,
    featuredOnly: false,
  });

  useEffect(() => {
    setFilterOptions((prev) => ({
      ...prev,
      categories,
      places,
    }));
  }, [categories, places]);

  const hasFilters =
    filterOptions.selectedCategories.length > 0 ||
    filterOptions.selectedPlaces.length > 0 ||
    filterOptions.nearMe ||
    filterOptions.featuredOnly;

  const hasQuery = query.trim().length > 0;

  const rows = useMemo<ItemWithDistance[]>(() => {
    const q = query.trim().toLowerCase();

    let filtered = (randomizedItems as ResultCardItem[]).filter((it) => {
      const inTitle = it.title?.toLowerCase().includes(q) ?? false;
      const inDesc = it.description?.toLowerCase().includes(q) ?? false;
      const inPlace =
        (it.location as string)?.toLowerCase().includes(q) ||
        (it.place as string)?.toLowerCase().includes(q) ||
        false;

      return q === "" || inTitle || inDesc || inPlace;
    }) as ItemWithDistance[];

    if (filterOptions.mode === "category") {
      if (filterOptions.selectedCategories.length > 0) {
        filtered = filtered.filter(
          (it) =>
            it.category &&
            filterOptions.selectedCategories.includes(it.category as string)
        );
      }
    } else {
      if (filterOptions.selectedPlaces.length > 0) {
        filtered = filtered.filter((it) => {
          const placeLabel =
            (it.location as string) || (it.place as string) || "";
          return (
            placeLabel &&
            filterOptions.selectedPlaces.includes(placeLabel)
          );
        });
      }
    }

    if (filterOptions.featuredOnly) {
      filtered = filtered.filter((it) => !!it.isPromo);
    }

    const withDist = filtered.map((it) => {
      if (!userLocation) return { ...it, distance: undefined };
      const coords = parseCoordinates(it);
      if (!coords) return { ...it, distance: undefined };
      return {
        ...it,
        distance: calculateDistance(userLocation, coords),
      };
    });

    if (filterOptions.nearMe && userLocation) {
      return withDist
        .filter((i) => typeof i.distance === "number")
        .sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999));
    }

    return withDist;
  }, [randomizedItems, query, filterOptions, userLocation]);

  const [refreshing, setRefreshing] = useState(false);
  const [slow, setSlow] = useState(false);
  const slowTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (refreshing) {
      slowTimerRef.current = setTimeout(() => {
        setSlow(true);
      }, 2500) as unknown as number;
    } else {
      setSlow(false);
      if (slowTimerRef.current !== null) {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
      }
    }
  }, [refreshing]);

  const refresh = async () => {
    setRefreshing(true);
    Haptics.selectionAsync().catch(() => {});

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const onToggleLayout = () => {
    toggleZoom();
  };

  const layoutIcon = zoomMode === "list" ? LayoutGrid : LayoutList;

  const onClearAllFilters = () => {
    setFilterOptions((prev) => ({
      ...prev,
      selectedCategories: [],
      selectedPlaces: [],
      nearMe: false,
      featuredOnly: false,
    }));
  };

  return (
    <GradientBackground>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <SearchFilterModal
        visible={filterVisible}
        theme={theme}
        options={filterOptions}
        onChange={setFilterOptions}
        onClose={() => setFilterVisible(false)}
      />

      <UniversalHeader
        title="Search"
        scrollY={scrollY}
        left={{ icon: "chevron-left", autoBack: true }}
        rightIcons={[
          {
            type: "icon",
            icon: "settings",
            onPress: () => setSettingsVisible(true),
          },
        ]}
      />

      <Animated.FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const distanceLabel =
            typeof item.distance === "number"
              ? formatDistance(item.distance)
              : undefined;

          return zoomMode === "list" ? (
            <ResultCard item={item} theme={theme} distance={distanceLabel} />
          ) : (
            <ResultCardZoom item={item} theme={theme} distance={distanceLabel} />
          );
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 24,
          paddingHorizontal: SCREEN_PAD,
        }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={refresh}
            tintColor={theme.button}
            colors={[theme.button]}
            progressBackgroundColor={theme.cardBackground}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.topRow}>
              <View style={{ flex: 1 }}>
                <SearchBar
                  value={query}
                  onChangeText={setQuery}
                  onClear={() => setQuery("")}
                  theme={theme}
                  placeholder="Search places, beaches, food…"
                />
              </View>

              <Pressable
                onPress={onToggleLayout}
                style={[styles.iconButton, { borderColor: theme.border }]}
              >
                {React.createElement(layoutIcon, {
                  size: 20,
                  color: theme.subtitle,
                })}
              </Pressable>

              <Pressable
                onPress={() => setFilterVisible(true)}
                style={[styles.iconButton, { borderColor: theme.border }]}
              >
                <SlidersHorizontal size={20} color={theme.button} />
              </Pressable>
            </View>

            <SlowNetworkHint visible={slow} />

            {(hasFilters || hasQuery) && (
              <View style={styles.filterSummaryRow}>
                <Text style={{
                  color: theme.subtitle,
                  flex: 1,
                  fontSize: typography.caption.fontSize
                }}>
                  {hasQuery && !hasFilters
                    ? "Search active. Tap filters to refine."
                    : hasFilters && !hasQuery
                      ? "Filters applied. Tap filters or Clear to reset."
                      : "Search + filters active. Tap Clear to reset filters."}
                </Text>

                {hasFilters && (
                  <Pressable
                    onPress={onClearAllFilters}
                    style={[
                      styles.clearChip,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.cardBackground,
                      },
                    ]}
                  >
                    <SlidersHorizontal
                      size={14}
                      color={theme.button}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={{ color: theme.button, fontSize: typography.caption.fontSize }}>
                      Clear filters
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            <Text
              style={{
                color: theme.description,
                fontSize: typography.subtitle.fontSize,
                marginBottom: 6,
                marginTop: 8,
              }}
            >
              Results ({rows.length})
            </Text>
          </>
        }
      />

      {(refreshing || loading) && (
        <View pointerEvents="none" style={styles.centerSpinner}>
          <ActivityIndicator size="large" color={theme.button} />
        </View>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  iconButton: {
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  clearChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  centerSpinner: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
