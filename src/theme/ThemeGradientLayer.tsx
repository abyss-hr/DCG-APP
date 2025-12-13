// File: src/theme/ThemeGradientLayer.tsx
// Description: Layer component providing gradient overlay matching the active theme.

import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * ThemeGradientLayer
 * -------------------
 * Reusable 2-color gradient for header/tabs with adjustable opacity & angle.
 * Reads from theme colors so you can tune easily in one place.
 */
type Props = {
  variant: 'header' | 'tabs';
  angle?: number; // 45°, 90°, 135°...
  style?: ViewStyle;
};

export const ThemeGradientLayer = ({ variant, angle = 135, style }: Props) => {
  const { theme } = useTheme();
  const colors = variant === 'header' ? theme.headerGradient : theme.tabGradient;
  const opacity = variant === 'header' ? theme.headerOpacity : theme.tabOpacity;

  const start = { x: 0, y: 0 };
  const end =
    angle === 135
      ? { x: 1, y: 1 }
      : angle === 90
      ? { x: 0, y: 1 }
      : angle === 45
      ? { x: 1, y: 0 }
      : { x: 1, y: 1 };

  return (
    <LinearGradient
      colors={[
        applyAlpha(colors[0], opacity),
        applyAlpha(colors[1], opacity),
      ]}
      start={start}
      end={end}
      style={[StyleSheet.absoluteFill, style]}
    />
  );
};

// Helper: add opacity to hex color
function applyAlpha(hex: string, opacity: number) {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return hex + alpha;
}