// app/(drawer)/(tabs)/index.tsx
'use client';

import { useTheme } from '@/theme/ThemeProvider';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoryCard from '@/components/cards/CategoryCard';
import Title from '@/components/ui/Title';
import TitleWithButton from '@/components/ui/TitleWithButton';
import OfflineBanner from '@/components/ui/OfflineBanner';
import SettingsModal from '@/components/modals/settings/SettingsModal';
import { GradientBackground } from '@/theme/GradientBackground';

type CardData = {
  size: 'single' | 'double';
  title: string;
  imageUrl: string;
  onPress: () => void;
};

const SLIDER_ITEM_WIDTH = 320;
const SLIDER_ITEM_SPACING = 2;

const HEADER_MAX = 96;
const HEADER_MIN = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX - HEADER_MIN;

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const { theme, mode, toggle } = useTheme();
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Haptics shortcut
  const doHaptic = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const openDrawer = useCallback(() => {
    doHaptic();
    navigation?.openDrawer?.();
  }, [navigation, doHaptic]);

  const goTo = useCallback(
    (screenInTabsGroup: string) => {
      doHaptic();
      navigation.navigate('(tabs)', { screen: screenInTabsGroup });
    },
    [navigation, doHaptic]
  );

  const goToTab = useCallback(
    (tabName: 'index' | 'search' | 'explore' | 'favorites') => {
      doHaptic();
      navigation.navigate('(tabs)', { screen: tabName });
    },
    [navigation, doHaptic]
  );

  // Scroll animation
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // MAIN tiles
  const primaryCards: CardData[] = useMemo(
    () => [
      {
        size: 'single',
        title: 'Explore city & islands',
        imageUrl:
          'https://firebasestorage.googleapis.com/v0/b/dubrovnikcityapp.firebasestorage.app/o/home_popular.webp?alt=media&token=8e55faee-f713-462d-945e-73afbb292fc3',
        onPress: () => goTo('explore'),
      },
      {
        size: 'double',
        title: 'Explore sights',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_old_town.webp',
        onPress: () => goToTab('explore'),
      },
      {
        size: 'double',
        title: 'Find a beach',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_find_a_beach.webp',
        onPress: () => goTo('(screens)/Beach'),
      },
      {
        size: 'double',
        title: "Let's eat",
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_restaurant.webp',
        onPress: () => goTo('(screens)/Restaurants'),
      },
      {
        size: 'double',
        title: 'Activities',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_popular.webp',
        onPress: () => goTo('(screens)/Experience'),
      },
    ],
    [goTo, goToTab]
  );

  // Slider data
  const placesData = useMemo(
    () => [
      {
        id: '1',
        title: 'Dubrovnik city',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_dubrovnik_old_town.webp',
        onPress: () => {
          doHaptic();
          goToTab('search');
        },
      },
      {
        id: '2',
        title: 'Island Koločep',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_kolocep.webp',
        onPress: () => router.push('/+not-found'),
      },
      {
        id: '3',
        title: 'Island Lopud',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_lopud.webp',
        onPress: () => router.push('/+not-found'),
      },
      {
        id: '4',
        title: 'Island Šipan',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_sipan.webp',
        onPress: () => router.push('/+not-found'),
      },
    ],
    [router, goToTab, doHaptic]
  );

  const secondaryCards: CardData[] = useMemo(
    () => [
      {
        size: 'double',
        title: 'History',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_good_to_know.webp',
        onPress: () => router.push('/+not-found'),
      },
      {
        size: 'double',
        title: 'Boat trips',
        imageUrl:
          'https://bhyqswfynsnqxzuukigp.supabase.co/storage/v1/object/public/listings-images/home_boat_trips.webp',
        onPress: () => router.push('/+not-found'),
      },
    ],
    [router]
  );

  const renderRow = useCallback(
    (cards: CardData[], key: string) => (
      <View key={key} style={styles.row}>
        {cards.map((card, i) => (
          <CategoryCard
            key={`${key}-${i}`}
            size={card.size}
            imageUrl={card.imageUrl}
            title={card.title}
            onPress={card.onPress}
            theme={theme}
          />
        ))}
      </View>
    ),
    [theme]
  );

  return (
    <GradientBackground>
      <OfflineBanner />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Collapsible Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <View style={styles.headerInner}>
          <TitleWithButton
            subtitle="Let's explore"
            title="Dubrovnik 2026"
            buttonLabel="Menu"
            iconName="grid"
            onPress={openDrawer}
            theme={theme}
            rightAccessory={
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  toggle();
                }}
                style={{ paddingHorizontal: 10, paddingVertical: 8 }}
              >
                <Feather
                  name={mode === 'dark' ? 'sun' : 'moon'}
                  size={22}
                  color={theme.button}
                />
              </Pressable>
            }
          />
        </View>
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + HEADER_MAX + 8 },
        ]}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {renderRow(primaryCards.slice(0, 1), 'primary-row-1')}
        {renderRow(primaryCards.slice(1, 3), 'primary-row-2')}
        {renderRow(primaryCards.slice(3, 5), 'primary-row-3')}

        {/* Slider */}
        <View style={styles.container}>
          <Title subtitle="Check" title="Places" theme={theme} />
        </View>
        <View style={styles.sliderContainer}>
          <FlatList
            horizontal
            data={placesData}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  marginRight: SLIDER_ITEM_SPACING,
                  width: SLIDER_ITEM_WIDTH,
                }}
              >
                <CategoryCard
                  size="single"
                  imageUrl={item.imageUrl}
                  title={item.title}
                  onPress={item.onPress}
                  theme={theme}
                />
              </View>
            )}
            initialNumToRender={4}
            windowSize={5}
            removeClippedSubviews
          />
        </View>

        {/* Secondary */}
        <View style={styles.container}>
          <Title subtitle="Learn something or" title="Have a fun" theme={theme} />
        </View>
        {renderRow(secondaryCards, 'secondary-row')}
      </Animated.ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  fullscreen: { flex: 1 },

  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    height: HEADER_MAX + 12,
  },

  headerInner: {
    paddingHorizontal: 6,
    paddingBottom: 6,
  },

  content: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },

  container: {
    paddingBottom: 10,
  },

  sliderContainer: {
    paddingBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
