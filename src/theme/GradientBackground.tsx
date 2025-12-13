// File: src/theme/GradientBackground.tsx
// Description: Animated 4-color blended gradient with smooth dark↔light crossfade.
// Direction-aware flow (dark = diagonal, light = vertical) and easing-tuned timing.

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './ThemeProvider';
import type { ColorValue } from 'react-native';

export const GradientBackground: React.FC<{
  children?: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  const { theme, effectiveMode } = useTheme();

  const currentGradient = theme.backgroundGradient as [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue
  ];

  // 🧠 Store previous gradient + mode to detect transition direction
  const [prevGradient, setPrevGradient] =
    useState<typeof currentGradient | null>(null);
  const [prevMode, setPrevMode] = useState<'light' | 'dark' | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Determine direction of transition using effective mode
  const goingToLight = prevMode === 'dark' && effectiveMode === 'light';
  const goingToDark = prevMode === 'light' && effectiveMode === 'dark';

  // Store old gradient/mode before theme change
  useEffect(() => {
    setPrevGradient(currentGradient);
    setPrevMode(effectiveMode);
  }, [effectiveMode]);

  // Run animation when gradient changes
  useEffect(() => {
    if (prevGradient && prevGradient !== currentGradient) {
      fadeAnim.setValue(0);

      // 🌞 Going to light → slower, smoother, slightly overshoot (brighter feel)
      // 🌚 Going to dark → faster fade
      const duration = goingToLight ? 2200 : 1300;
      const easing = goingToLight
        ? Easing.out(Easing.exp)
        : Easing.inOut(Easing.cubic);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      }).start(() => setPrevGradient(null));
    }
  }, [currentGradient]);

  // 🎨 Opacity interpolation (delayed for dark→light)
  const opacity = fadeAnim.interpolate({
    inputRange: goingToLight ? [0, 0.5, 1] : [0, 1],
    outputRange: goingToLight ? [0, 0.6, 1] : [0, 1],
  });

  return (
    <Animated.View style={[styles.container, style]}>
      {/* 🪶 Previous gradient layer */}
      {prevGradient && (
        <LinearGradient
          colors={prevGradient as [ColorValue, ColorValue, ...ColorValue[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* 🌈 Current gradient layer */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.03, 1],
                }),
              },
            ],
          },
        ]}
      >
        {/* Layer 1 – direction-aware blend */}
        <LinearGradient
          colors={currentGradient as [ColorValue, ColorValue, ...ColorValue[]]}
          start={{ x: 0, y: 0 }}
          end={effectiveMode === 'light' ? { x: 0, y: 1 } : { x: 1, y: 1 }} // vertical for light, diagonal for dark
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2 – subtle reversed overlay for depth */}
        <LinearGradient
          colors={[...currentGradient].reverse() as [
            ColorValue,
            ColorValue,
            ...ColorValue[]
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        />
      </Animated.View>

      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
});
