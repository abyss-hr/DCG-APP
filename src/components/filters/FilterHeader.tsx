// FilterHeader.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  LayoutChangeEvent,
  Text,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ColorTheme } from '@/theme/colors';
import { typography } from '@/theme';

export type FilterMode = 'category' | 'place' | 'all';

type Props = {
  theme: ColorTheme;
  titleA?: string;
  titleB?: string;
  titleAll?: string;
  optionsA: string[];
  optionsB: string[];
  mode: FilterMode;
  onToggleMode: (m: FilterMode) => void;
  selectedCategories: string[];
  selectedPlaces: string[];
  onToggleCategoryValue: (value: string) => void;
  onTogglePlaceValue: (value: string) => void;
  onClearAll: () => void;
  hasSelection?: boolean; // ✅ new prop
};

export default function FilterHeader({
  theme,
  titleA = 'Category',
  titleB = 'Place',
  titleAll = 'All',
  optionsA,
  optionsB,
  mode,
  onToggleMode,
  selectedCategories,
  selectedPlaces,
  onToggleCategoryValue,
  onTogglePlaceValue,
  onClearAll,
  hasSelection = false,
}: Props) {
  const pillLeft = useRef(new Animated.Value(0)).current;
  const pillW = useRef(new Animated.Value(0)).current;
  const segLayouts = useRef<Record<FilterMode, { x: number; w: number } | undefined>>({
    category: undefined,
    place: undefined,
    all: undefined,
  });

  const animateTo = (m: FilterMode, immediate = false) => {
    const layout = segLayouts.current[m];
    if (!layout) return;
    Animated.parallel([
      Animated.timing(pillLeft, {
        toValue: layout.x,
        duration: immediate ? 0 : 200,
        useNativeDriver: false,
      }),
      Animated.timing(pillW, {
        toValue: layout.w,
        duration: immediate ? 0 : 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    const t = setTimeout(() => animateTo(mode, true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    animateTo(mode, false);
  }, [mode]);

  const onSegLayout =
    (key: FilterMode) =>
    (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      segLayouts.current[key] = { x: Math.round(x), w: Math.round(width) };
      if (key === mode) animateTo(mode, true);
    };

  const Chips = ({
    title,
    options,
    selected,
    onToggle,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
  }) => (
    <>
      <Text style={{ color: theme.subtitle, marginTop: 10, fontSize: typography.subtitle.fontSize }}>
        {title}
      </Text>
      <View style={styles.chipsRow}>
        {options.map((label) => {
          const isSel = selected.includes(label);
          return (
            <Pressable
              key={label}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onToggle(label);
              }}
              style={[
                styles.chip,
                {
                  borderColor: isSel ? theme.subtitle : theme.border, // ✅ updated
                  backgroundColor: isSel ? theme.button + '20' : 'transparent', // soft tint
                },
              ]}
            >
              <Text
                style={{ color: isSel ? theme.subtitle : theme.button, fontSize: typography.button.fontSize }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.spacerRow}>
        <Text style={{ color: theme.subtitle, fontSize: typography.subtitle.fontSize }}>
          Filter by
        </Text>
      </View>

      {/* Mode switcher */}
      <View style={styles.switchRow}>
        <View
          style={[styles.switchWrap, { borderColor: theme.buttonInactive }]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.switchPill,
              { backgroundColor: theme.buttonActive, left: pillLeft, width: pillW },
            ]}
          />

          <View style={styles.segmentFlex} onLayout={onSegLayout('category')}>
            <Pressable 
              style={styles.segmentBtnFlush} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onToggleMode('category');
              }}
            >
              <Text
                style={{
                  color: mode === 'category' ? '#fff' : theme.buttonInactive,
                  fontSize: typography.button.fontSize,
                }}
              >
                {titleA}
              </Text>
            </Pressable>
          </View>

          <View style={styles.segmentFlex} onLayout={onSegLayout('place')}>
            <Pressable 
              style={styles.segmentBtn} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onToggleMode('place');
              }}
            >
              <Text
                style={{
                  color: mode === 'place' ? '#fff' : theme.buttonInactive,
                  fontSize: typography.button.fontSize,
                }}
              >
                {titleB}
              </Text>
            </Pressable>
          </View>

          <View style={styles.segmentAuto} onLayout={onSegLayout('all')}>
            <Pressable 
              style={styles.segmentBtnSmall} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onToggleMode('all');
              }}
            >
              <Text
                style={{
                  color: mode === 'all' ? '#fff' : theme.buttonInactive,
                  fontSize: typography.button.fontSize,
                }}
              >
                {titleAll}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ✅ Clear all visual change */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onClearAll();
          }}
          style={[
            styles.clearBtn,
            {
              borderColor: hasSelection ? theme.button : theme.border,
              backgroundColor: hasSelection ? theme.button + '20' : 'transparent',
            },
          ]}
        >
          <Text
            style={{ color: hasSelection ? theme.subtitle : theme.button, fontSize: typography.button.fontSize }}
          >
            Clear all
          </Text>
        </Pressable>
      </View>

      {/* Chips */}
      {mode === 'category' && (
        <Chips
          title={titleA}
          options={optionsA}
          selected={selectedCategories}
          onToggle={onToggleCategoryValue}
        />
      )}

      {mode === 'place' && (
        <Chips
          title={titleB}
          options={optionsB}
          selected={selectedPlaces}
          onToggle={onTogglePlaceValue}
        />
      )}

      {mode === 'all' && (
        <>
          <Chips
            title={titleA}
            options={optionsA}
            selected={selectedCategories}
            onToggle={onToggleCategoryValue}
          />
          <Chips
            title={titleB}
            options={optionsB}
            selected={selectedPlaces}
            onToggle={onTogglePlaceValue}
          />
        </>
      )}
    </View>
  );
}

const P = 12;
const styles = StyleSheet.create({
  container: { paddingHorizontal: P, paddingTop: 8, paddingBottom: 2 },
  spacerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  switchWrap: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    marginRight: 10,
  },
  switchPill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 22 },
  segmentFlex: { flex: 1 },
  segmentAuto: { paddingHorizontal: 8 },
  segmentBtnFlush: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtn: { paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  segmentBtnSmall: { paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  clearBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 22, borderWidth: 1 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  
  chip: {
  paddingHorizontal: 8, // was 14
  paddingVertical: 4,    // was 8
  borderRadius: 999,
  borderWidth: 1,
  marginRight: 6,        // slightly tighter spacing
  marginBottom: 6,
},
});
