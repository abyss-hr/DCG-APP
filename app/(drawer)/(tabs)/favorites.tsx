import { useNavigation } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ResultCard from '@/components/cards/ResultCard';
import ResultCardZoom from '@/components/cards/ResultCardZoom';
import { useFavorites } from '@/components/context/FavoritesContext';
import { useZoom } from '@/components/context/ZoomContext';
import CategoryPickerModal from '@/components/modals/CategoryPickerModal';
import SettingsModal from '@/components/modals/settings/SettingsModal';
import SlowNetworkHint from '@/components/ui/SlowNetworkHint';
import ToolbarRow from '@/components/ui/ToolbarRow';
import UniversalHeader, {
  HEADER_BODY,
} from '@/components/ui/UniversalHeader';
import type { ResultCardItem } from '@/database/listingAdapter';
import { useRefreshWithHint } from '@/hooks/useRefreshWithHint';
import { GradientBackground, typography, useTheme } from '@/theme';

const SCREEN_PAD = 12;

/* Normalize favorites into ResultCardItem */
function normalizeFav(raw: any): ResultCardItem {
  const images: string[] =
    (Array.isArray(raw?.imageUrls) && raw.imageUrls.length
      ? raw.imageUrls
      : undefined) ??
    (Array.isArray(raw?.imageUrl) && raw.imageUrl.length
      ? raw.imageUrl
      : undefined) ??
    (raw?.imageUrl ? [raw.imageUrl] : []);

  const videoUrls: string[] | undefined = Array.isArray(raw?.videoUrls)
    ? raw.videoUrls
    : raw?.videoUrl
    ? [raw.videoUrl]
    : undefined;

  return {
    id: raw?.id ?? raw?.$id ?? String(Date.now()),
    title: raw?.title ?? 'Saved item',
    description: raw?.description ?? '',
    category: raw?.category,
    location: raw?.location,
    place: raw?.place,
    imageUrl: images[0] ?? '',
    imageUrls: images,
    isPromo: !!(raw?.isPromo ?? raw?.isPromoted),
    isPopular: !!raw?.isPopular,
    videoUrls,
  };
}

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentPadTop = HEADER_BODY + insets.top + SCREEN_PAD;

  const { favorites } = useFavorites();

  const favArray: any[] = useMemo(() => {
    try {
      if (Array.isArray(favorites)) return favorites;
      if (favorites && typeof favorites === 'object') {
        return Object.values(favorites) as any[];
      }
    } catch {}

    return [];
  }, [favorites]);

  const items: ResultCardItem[] = useMemo(() => {
    const map = new Map<string, ResultCardItem>();
    for (const f of favArray) {
      const id = f?.id ?? f?.$id;
      if (id) map.set(String(id), normalizeFav(f));
    }
    return Array.from(map.values());
  }, [favArray]);

  const presentCats = useMemo(() => {
    const s = new Set<string>();
    for (const r of items) if (r.category) s.add(r.category as string);
    return Array.from(s);
  }, [items]);

  const { zoomMode, toggleZoom } = useZoom();

  const [filter, setFilter] = useState<'All' | string>('All');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const rows = useMemo(
    () => (filter === 'All' ? items : items.filter((x) => x.category === filter)),
    [filter, items]
  );
  const filterLabel = filter === 'All' ? 'All categories' : filter;

  const { refreshing, slow, refresh } = useRefreshWithHint({
    delayMs: 400,
    slowHintAfterMs: 2500,
    onRefresh: async () => {
      await new Promise((r) => setTimeout(r, 350));
    },
  });

  return (
    <GradientBackground>
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <UniversalHeader
        title="Favorites"
        scrollY={scrollY}
        left={{ icon: 'chevron-left', autoBack: true }}
        rightIcons={[
          {
            type: 'icon',
            icon: 'settings',
            onPress: () => setSettingsVisible(true),
          },
          {
            type: 'icon',
            icon: 'grid',
            onPress: () => navigation.getParent()?.openDrawer?.(),
          },
        ]}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.button}
            colors={[theme.button]}
            progressBackgroundColor={theme.cardBackground}
          />
        }
      >
        <SlowNetworkHint visible={slow} />

        <View style={{ paddingHorizontal: SCREEN_PAD }}>
          <ToolbarRow
            theme={theme}
            count={rows.length}
            layout={zoomMode}
            onToggleLayout={toggleZoom}
            onOpenFilter={() => setPickerOpen(true)}
            filterLabel={filterLabel}
          />
        </View>

        {items.length === 0 ? (
          <View style={[styles.emptyWrap]}>
            <Text
              style={{
                color: theme.subtitle,
                marginTop: 8,
                textAlign: 'center',
                fontSize: typography.caption.fontSize,
              }}
            >
              You haven't saved anything yet.{'\n'}
              Tap the heart on a card to add it here.
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 8, paddingHorizontal: SCREEN_PAD }}>
            {rows.map((item) =>
              zoomMode === 'list' ? (
                <ResultCard key={item.id} item={item} theme={theme} />
              ) : (
                <ResultCardZoom key={item.id} item={item} theme={theme} />
              )
            )}
          </View>
        )}
      </Animated.ScrollView>

      {refreshing && (
        <View pointerEvents="none" style={styles.centerSpinner}>
          <ActivityIndicator size="large" color={theme.button} />
        </View>
      )}

      <CategoryPickerModal
        visible={pickerOpen}
        theme={theme}
        categories={presentCats}
        selected={filter}
        onSelect={(val) => setFilter(val as 'All' | string)}
        onClose={() => setPickerOpen(false)}
        title="Filter favorites"
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  centerSpinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
