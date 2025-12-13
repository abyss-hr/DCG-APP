// components/system/AppStatusBar.tsx
import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Android (edge-to-edge):
 * - Do NOT set StatusBar backgroundColor (it’s ignored and logs a warning).
 * - Instead, render a top spacer with the desired background color.
 *
 * iOS:
 * - Only the text/icon color matters; background is whatever is behind it.
 */
export default function AppStatusBar({
  hidden = false,
  withBackground = false, // render a top spacer under the status bar area (Android)
}: {
  hidden?: boolean;
  withBackground?: boolean;
}) {
  const { theme, effectiveMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Android: draw our own background under the status bar area */}
      {Platform.OS === 'android' && withBackground ? (
        <View style={{ height: insets.top, backgroundColor: theme.backgroundDark }} />
      ) : null}

      <StatusBar
        hidden={hidden}
        translucent
        style={effectiveMode === 'dark' ? 'light' : 'dark'}
        // DO NOT set backgroundColor here; Android edge-to-edge ignores it and warns.
      />
    </>
  );
}