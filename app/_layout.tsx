// File: app/_layout.tsx
// Description: Root layout — wraps the entire app with providers and global gradient background.

'use client';

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 🧩 Theme & Providers (centralized)
import { ThemeProvider, useTheme, GradientBackground } from '@/theme';
import { FavoritesProvider } from '@/components/context/FavoritesContext';
import { OfflineProvider } from '@/components/context/OfflineContext';
import { LocationProvider } from '@/components/context/LocationContext';
import { ZoomProvider } from '@/components/context/ZoomContext';

// ⚙️ System UI
import AppStatusBar from '@/components/system/AppStatusBar';

/**
 * InnerStack
 * -----------
 * Handles navigation + status bar styling according to active theme.
 */
function InnerStack() {
  const { effectiveMode } = useTheme();
  return (
    <>
      <AppStatusBar />
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={effectiveMode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

/**
 * RootLayout
 * -----------
 * Main app entry — wraps everything in:
 * - GestureHandlerRootView
 * - SafeAreaProvider
 * - ThemeProvider (light/dark/system)
 * - FavoritesProvider (user favorites context)
 * - GradientBackground (global animated theme backdrop)
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ZoomProvider>
            <OfflineProvider>
              <LocationProvider>
                <FavoritesProvider>
                  <GradientBackground>
                    <InnerStack />
                  </GradientBackground>
                </FavoritesProvider>
              </LocationProvider>
            </OfflineProvider>
          </ZoomProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
