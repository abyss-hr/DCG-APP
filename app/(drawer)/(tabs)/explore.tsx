// // Explore screen - Popular swipe cards + recommended listings

// import { router, useNavigation } from "expo-router";
// import { LayoutGrid, LayoutList, SlidersHorizontal, Sparkles } from "lucide-react-native";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
// } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Pressable,
//   RefreshControl,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import ResultCard from "@/components/cards/ResultCard";
// import ResultCardZoom from "@/components/cards/ResultCardZoom";
// import ExploreFilterModal, {
//   ExploreFilterOptions,
// } from "@/components/modals/ExploreFilterModal";
// import SettingsModal from "@/components/modals/settings/SettingsModal";
// import FeaturedCarousel from "@/components/ui/FeaturedCarousel";
// import SlowNetworkHint from "@/components/ui/SlowNetworkHint";
// import UniversalHeader, {
//   getHeaderHeights,
// } from "@/components/ui/UniversalHeader";

// import { useLocation } from "@/components/context/LocationContext";
// import { useZoom } from "@/components/context/ZoomContext";
// // import { useExperiences } from "@/database/useListings";
// import { useRefreshWithHint } from "@/hooks/useRefreshWithHint";
// import { GradientBackground, typography, useTheme } from "@/theme";
// import {
//   calculateDistance,
//   formatDistance,
//   parseCoordinates,
// } from "@/utils/distanceUtils";

// import type { ResultCardItem } from "@/database/listingAdapter";

// const SCREEN_PAD = 12;

// type ItemWithDistance = ResultCardItem & { distance?: number };

// // Simple shuffle util
// function shuffleArray<T>(array: T[]): T[] {
//   const arr = [...array];
//   for (let i = arr.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     const tmp = arr[i];
//     arr[i] = arr[j];
//     arr[j] = tmp;
//   }
//   return arr;
// }

// export default function ExploreScreen() {
//   const { theme } = useTheme();
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation<any>();

//   const scrollY = useRef(new Animated.Value(0)).current;
//   const { headerTotal } = getHeaderHeights(insets.top);
//   const contentPadTop = headerTotal + SCREEN_PAD;

//   const [settingsVisible, setSettingsVisible] = React.useState(false);
//   const [filterVisible, setFilterVisible] = React.useState(false);
//   const [filterOptions, setFilterOptions] = React.useState<ExploreFilterOptions>({
//     categories: [],
//     places: [],
//     mode: "category",
//     selectedCategories: [],
//     selectedPlaces: [],
//     nearMe: false,
//     featuredOnly: true,
//   });

//   const { data: items = [], isLoading: loading, refetch } = useExperiences({
//     limit: 120,
//   });

//   const allItems = items as ResultCardItem[];

//   const categories = useMemo(() => {
//     const s = new Set<string>();
//     for (const it of allItems) if (it.category) s.add(String(it.category));
//     return Array.from(s);
//   }, [allItems]);

//   const places = useMemo(() => {
//     const s = new Set<string>();
//     for (const it of allItems) {
//       const label =
//         (it.location as string) ||
//         (it.place as string) ||
//         "";
//       if (label) s.add(label);
//     }
//     return Array.from(s);
//   }, [allItems]);

//   useEffect(() => {
//     setFilterOptions((prev) => ({
//       ...prev,
//       categories,
//       places,
//     }));
//   }, [categories, places]);

//   const { userLocation } = useLocation();
//   const { zoomMode, toggleZoom } = useZoom();

//  const popularItems = useMemo(
//   () =>
//     shuffleArray(
//       allItems.filter((x) => x.isPromo)
//     )
//       .slice(0, 10)
//       .map((x) => ({
//         id: x.id,
//         title: x.title,
//         subtitle: (x.location as string) || (x.place as string) || "",
//         image:
//           Array.isArray(x.imageUrl)
//             ? x.imageUrl[0] ?? undefined
//             : x.imageUrl ?? undefined,
//         badge: "Popular",
//         onPress: () => router.push(`/(drawer)/(listing)/${x.id}`),
//       })),
//   [allItems]
// );



//   const recommendedItems = useMemo<ItemWithDistance[]>(() => {
//     let filtered = allItems;

//     if (filterOptions.mode === "category" && filterOptions.selectedCategories.length > 0) {
//       filtered = filtered.filter(
//         (it) =>
//           it.category &&
//           filterOptions.selectedCategories.includes(it.category as string)
//       );
//     }

//     if (filterOptions.mode === "place" && filterOptions.selectedPlaces.length > 0) {
//       filtered = filtered.filter((it) => {
//         const placeLabel =
//           (it.location as string) || (it.place as string) || "";
//         return placeLabel && filterOptions.selectedPlaces.includes(placeLabel);
//       });
//     }

//     if (filterOptions.featuredOnly) {
//       filtered = filtered.filter((it) => !!it.isPromo);
//     }

//     const withDistances: ItemWithDistance[] = filtered
//       .map((item) => {
//         if (!userLocation) return { ...item, distance: undefined };
//         const coords = parseCoordinates(item);
//         if (!coords) return { ...item, distance: undefined };
//         const distance = calculateDistance(userLocation, coords);
//         return { ...item, distance };
//       })
//       .filter(Boolean) as ItemWithDistance[];

//     if (filterOptions.nearMe && userLocation) {
//       return withDistances
//         .filter((i) => typeof i.distance === "number")
//         .sort((a, b) => (a.distance ?? 999999) - (b.distance ?? 999999));
//     }

//     return shuffleArray(withDistances);
//   }, [allItems, userLocation, filterOptions]);

//   const onDoRefresh = useCallback(async () => {
//     await refetch();
//   }, [refetch]);

//   const { refreshing, slow, refresh } = useRefreshWithHint({
//     onRefresh: onDoRefresh,
//   });

//   const hasItems = allItems.length > 0;
//   const hasFilters =
//     filterOptions.selectedCategories.length > 0 ||
//     filterOptions.selectedPlaces.length > 0 ||
//     filterOptions.nearMe ||
//     !filterOptions.featuredOnly;

//   const onToggleLayout = () => {
//     toggleZoom();
//   };

//   const layoutIcon = zoomMode === "list" ? LayoutGrid : LayoutList;

//   const onClearAllFilters = () => {
//     setFilterOptions((prev) => ({
//       ...prev,
//       selectedCategories: [],
//       selectedPlaces: [],
//       nearMe: false,
//       featuredOnly: true,
//     }));
//   };

//   return (
//     <GradientBackground>
//       <UniversalHeader
//         title="Explore"
//         scrollY={scrollY}
//         left={{ icon: "chevron-left", autoBack: true }}
//         rightIcons={[
//           {
//             type: "icon",
//             icon: "settings",
//             onPress: () => setSettingsVisible(true),
//           },
//           {
//             type: "icon",
//             icon: "grid",
//             onPress: () => navigation.getParent()?.openDrawer?.(),
//           },
//         ]}
//       />

//       <SettingsModal
//         visible={settingsVisible}
//         onClose={() => setSettingsVisible(false)}
//       />

//       <ExploreFilterModal
//         visible={filterVisible}
//         theme={theme}
//         options={filterOptions}
//         onChange={setFilterOptions}
//         onClose={() => setFilterVisible(false)}
//       />

//       <Animated.ScrollView
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         contentContainerStyle={{
//           paddingTop: contentPadTop,
//           paddingBottom: 32,
//         }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing || loading}
//             onRefresh={refresh}
//             tintColor={theme.button}
//             colors={[theme.button]}
//             progressBackgroundColor={theme.cardBackground}
//           />
//         }
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={[styles.topRow, { paddingHorizontal: SCREEN_PAD }]}>
//           <View style={styles.titleContainer}>
//             <Sparkles size={20} color={theme.button} strokeWidth={2} />
//             <Text style={[styles.topTitle, { color: theme.title }]}>
//               Most Popular
//             </Text>
//           </View>

//           <Pressable
//             onPress={onToggleLayout}
//             style={[styles.iconButton, { borderColor: theme.border }]}
//           >
//             {React.createElement(layoutIcon, {
//               size: 20,
//               color: theme.subtitle,
//             })}
//           </Pressable>

//           <Pressable
//             onPress={() => setFilterVisible(true)}
//             style={[styles.iconButton, { borderColor: theme.border }]}
//           >
//             <SlidersHorizontal size={20} color={theme.button} />
//           </Pressable>
//         </View>

//         <View style={{ paddingHorizontal: SCREEN_PAD }}>
//           <SlowNetworkHint visible={slow} />
//         </View>

//         {hasFilters && (
//           <View style={[styles.filterSummaryRow, { paddingHorizontal: SCREEN_PAD }]}>
//             <Text style={{ color: theme.subtitle, flex: 1, fontSize: typography.caption.fontSize }}>
//               Filters applied. Tap Clear to reset.
//             </Text>
//             <Pressable
//               onPress={onClearAllFilters}
//               style={[
//                 styles.clearChip,
//                 {
//                   borderColor: theme.border,
//                   backgroundColor: theme.cardBackground,
//                 },
//               ]}
//             >
//               <SlidersHorizontal
//                 size={14}
//                 color={theme.button}
//                 style={{ marginRight: 4 }}
//               />
//               <Text style={{ color: theme.button, fontSize: typography.caption.fontSize }}>
//                 Clear filters
//               </Text>
//             </Pressable>
//           </View>
//         )}

//         {hasItems && (
//           <>
//             {popularItems.length > 0 && (
//               <View style={styles.section}>
//                 <FeaturedCarousel items={popularItems} theme={theme} />
//               </View>
//             )}

//             <View style={[styles.section, { paddingHorizontal: SCREEN_PAD }]}>
//               <View style={styles.sectionHeader}>
//                 <View style={styles.sectionHeaderLeft}>
//                   <View style={[styles.iconBadge, { backgroundColor: `${theme.button}15` }]}>
//                     <Sparkles size={18} color={theme.button} strokeWidth={2} />
//                   </View>
//                   <View style={styles.sectionHeaderText}>
//                     <Text style={[styles.sectionTitle, { color: theme.title }]}>
//                       Recommended for you
//                     </Text>
//                     <Text style={[styles.sectionSubtitle, { color: theme.subtitle }]}>
//                       {recommendedItems.length} places
//                       {filterOptions.featuredOnly && " • Featured"}
//                       {filterOptions.nearMe && " • Nearby"}
//                       {filterOptions.selectedCategories.length > 0 &&
//                         ` • ${filterOptions.selectedCategories.length} ${
//                           filterOptions.selectedCategories.length === 1 ? "category" : "categories"
//                         }`}
//                       {filterOptions.selectedPlaces.length > 0 &&
//                         ` • ${filterOptions.selectedPlaces.length} ${
//                           filterOptions.selectedPlaces.length === 1 ? "place" : "places"
//                         }`}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.cardGrid}>
//                 {recommendedItems.map((item) => {
//                   const distanceLabel =
//                     typeof item.distance === "number"
//                       ? formatDistance(item.distance)
//                       : undefined;

//                   return zoomMode === "list" ? (
//                     <ResultCard
//                       key={item.id}
//                       item={item}
//                       theme={theme}
//                       distance={distanceLabel}
//                     />
//                   ) : (
//                     <View key={item.id} style={styles.cardWrapper}>
//                       <ResultCardZoom
//                         item={item}
//                         theme={theme}
//                         distance={distanceLabel}
//                       />
//                     </View>
//                   );
//                 })}
//               </View>
//             </View>
//           </>
//         )}

//         {!hasItems && !loading && (
//           <View style={[styles.emptyState, { paddingHorizontal: SCREEN_PAD }]}>
//             <Text
//               style={{
//                 marginTop: 20,
//                 fontSize: 18,
//                 fontWeight: "600",
//                 color: theme.subtitle,
//                 textAlign: "center",
//               }}
//             >
//               No places available yet
//             </Text>
//           </View>
//         )}
//       </Animated.ScrollView>

//       {(refreshing || loading) && (
//         <View pointerEvents="none" style={styles.centerSpinner}>
//           <ActivityIndicator size="large" color={theme.button} />
//         </View>
//       )}
//     </GradientBackground>
//   );
// }

// const styles = StyleSheet.create({
//   centerSpinner: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyState: {
//     paddingTop: 80,
//     alignItems: "center",
//     paddingHorizontal: 32,
//   },
//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   titleContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   topTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   iconButton: {
//     padding: 10,
//     borderRadius: 999,
//     borderWidth: 1,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 14,
//   },
//   sectionHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   iconBadge: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   sectionHeaderText: {
//     flex: 1,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 2,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//   },
//   cardGrid: {},
//   cardWrapper: {
//     marginBottom: 0,
//   },
//   filterSummaryRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//     gap: 8,
//   },
//   clearChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderRadius: 999,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
// });


import { View, Text } from 'react-native'
import React from 'react'

const explore = () => {
  return (
    <View>
      <Text>explore</Text>
    </View>
  )
}

export default explore