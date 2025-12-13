// components/ui/HeartButton.tsx
'use client';

import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useMemo, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

type Props = {
  filled: boolean;
  colorActive: string;   // e.g. theme.favorite
  colorInactive?: string; // default '#666'
  size?: number;          // default 20
  onToggle: () => void;
  hitSlop?: number | { top: number; bottom: number; left: number; right: number };
};

/** Bouncy heart with haptics */
function HeartButtonBase({
  filled,
  colorActive,
  colorInactive = '#666',
  size = 20,
  onToggle,
  hitSlop = 8,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const color = useMemo(() => (filled ? colorActive : colorInactive), [filled, colorActive, colorInactive]);

  const animate = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true, speed: 30, bounciness: 10 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
    ]).start();
  };

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    animate();
    onToggle();
  };

  return (
    <Pressable hitSlop={hitSlop} onPress={onPress} accessibilityRole="button" accessibilityLabel="Toggle favorite">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather name="heart" size={size} color={color} />
      </Animated.View>
    </Pressable>
  );
}

export default memo(HeartButtonBase);