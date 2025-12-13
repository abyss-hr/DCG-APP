'use client';

import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Animated, Pressable, StyleSheet, View, Text } from 'react-native';

import HeartButton from '@/components/ui/HeartButton';
import { getHeaderHeights, HEADER_BODY } from '@/components/ui/UniversalHeader';
// import { getLastListRoute } from '@/lib/nav/lastRoute';
import { useTheme, typography } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  scrollY: Animated.Value;
  title: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function DetailsHeader({ scrollY, title, isFavorite, onToggleFavorite }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const { headerTotal } = getHeaderHeights(insets.top);

  const translateY = scrollY.interpolate({
    inputRange: [0, headerTotal],
    outputRange: [0, -headerTotal],
    extrapolate: 'clamp',
  });

  function goBack() {
    // 1) If there is stack history, pop it.
    // @ts-ignore
    if (navigation?.canGoBack?.()) {
      // @ts-ignore
      navigation.goBack();
      return;
    }
    // 2) If caller provided a route, replace to it.
    if (from && typeof from === 'string') {
      // @ts-ignore (expo-router types are strict about path enums)
      router.replace(from);
      return;
    }
    // 3) Last known list route fallback.
    // const fallback = getLastListRoute() || '/(drawer)/(tabs)/explore';
    // @ts-ignore
    // router.replace(fallback);
  }

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerTotal,
          paddingTop: insets.top,
          backgroundColor: theme.backgroundDark,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.row}>
        <Pressable
          hitSlop={8}
          style={styles.edgeBtn}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            goBack();
          }}
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={22} color={theme.button} />
        </Pressable>

        <Text
          numberOfLines={1}
          style={{ color: theme.title, fontSize: 20, fontWeight: '700', flexShrink: 1 }}
        >
          {title}
        </Text>

        <View style={styles.edgeBtn}>
          <HeartButton
            filled={isFavorite}
            colorActive={theme.favorite}
            colorInactive="#666"
            size={22}
            onToggle={() => {
              Haptics.selectionAsync().catch(() => {});
              onToggleFavorite();
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 10, justifyContent: 'center', elevation: 3 },
  row: {
    height: HEADER_BODY,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  edgeBtn: { padding: 8, minWidth: 36, alignItems: 'center' },
});