'use client';

import React from 'react';
import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import type { ColorValue } from 'react-native';

// ⚠️ CHANGE HERE — Use Lucide icons instead of Feather
import { Home, House, LayoutGrid, Search, Compass, Heart as HeartIcon, HelpCircle } from "lucide-react-native";

// 🎨 Theming
import { useTheme } from '@/theme/ThemeProvider';
import { lightTheme, darkTheme } from '@/theme/colors';

// ❤️ Favorites context
import { useFavorites } from '@/components/context/FavoritesContext';

// 🌈 Unified background wrapper
import { GradientBackground } from '@/theme/GradientBackground';

/* ─────────────────────────────────────────────
   🧭 TabIcon() — SVG icon wrapper
────────────────────────────────────────────── */
// ⚠️ NO CHANGE — This already supports lucide SVG icons
function TabIcon({
  icon: Icon,
  color,
  size,
}: {
  icon: React.ComponentType<any>;
  color: string;
  size: number;
}) {
  return <Icon size={size} color={color} stroke={color} strokeWidth={1.5} />;
}

/* ─────────────────────────────────────────────
   🌈 TabsLayout()
────────────────────────────────────────────── */
export default function TabsLayout() {
  const { theme } = useTheme();
  const { favorites } = useFavorites();

  const favCount =
    Array.isArray(favorites)
      ? favorites.length
      : favorites && typeof favorites === 'object'
        ? Object.keys(favorites).length
        : 0;

  const hasValidGradient =
    Array.isArray(theme?.tabGradient) &&
    theme.tabGradient.length >= 2 &&
    theme.tabGradient.every(Boolean);

  const gradientColors: [ColorValue, ColorValue] = hasValidGradient
    ? theme.tabGradient
    : theme.mode === 'dark'
      ? darkTheme.tabGradient
      : lightTheme.tabGradient;

  const hapticsListener = {
    tabPress: () => Haptics.selectionAsync().catch(() => {}),
  };

  return (
    <GradientBackground>
      <Tabs
        screenOptions={() => ({
          headerShown: false,

          /* ⚠️ THEME COLORS (Lucide icons use these automatically) */
          tabBarActiveTintColor: theme.tabIconActive,
          tabBarInactiveTintColor: theme.tabIconInactive,

          tabBarBackground: () => (
            <LinearGradient
              colors={[gradientColors[0], gradientColors[1]] as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, opacity: theme.tabOpacity }}
            />
          ),

          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0.5,
            borderTopColor:
              theme.mode === 'dark'
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.08)',
            height: 66,
            paddingBottom: 6,
            elevation: 10,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        })}
      >

        {/* 🏠 Home Tab */}
        {/* ⚠️ REPLACED Feather → Lucide */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon={House} color={color} size={size} />
            ),
          }}
          listeners={hapticsListener}
        />

        {/* 🔍 Search Tab */}
        {/* ⚠️ REPLACED Feather → Lucide */}
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon={Search} color={color} size={size} />
            ),
          }}
          listeners={hapticsListener}
        />

        {/* 🧭 Explore Tab */}
        {/* ⚠️ REPLACED Feather → Lucide */}
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon={Compass} color={color} size={size} />
            ),
          }}
          listeners={hapticsListener}
        />

        {/* ❤️ Favorites Tab */}
        {/* ⚠️ REPLACED Feather → Lucide */}
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon={HeartIcon} color={color} size={size} />
            ),
            tabBarBadge:
              favCount > 0 ? (favCount > 99 ? '99+' : favCount) : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#FF5A5F',
              color: '#fff',
              fontWeight: '700',
              minWidth: 16,
              height: 16,
              lineHeight: 16,
              paddingHorizontal: 4,
            },
          }}
          listeners={hapticsListener}
        />

        {/* 🧪 Test Tab */}
        {/* ⚠️ REPLACED Feather → Lucide */}
        <Tabs.Screen
          name="test"
          options={{
            title: 'Test',
            tabBarIcon: ({ color, size }) => (
              <TabIcon icon={HelpCircle} color={color} size={size} />
            ),
          }}
          listeners={hapticsListener}
        />

        {/* Hidden screens */}
        <Tabs.Screen name="(screens)/popular" options={{ href: null }} />
        <Tabs.Screen name="(screens)/sights" options={{ href: null }} />
        <Tabs.Screen name="(screens)/experience" options={{ href: null }} />
        <Tabs.Screen name="(screens)/beach" options={{ href: null }} />
        <Tabs.Screen name="(screens)/food-and-drink" options={{ href: null }} />

        <Tabs.Screen name="(screens)/loc-dubrovnik" options={{ href: null }} />
        <Tabs.Screen name="(screens)/loc-kolocep" options={{ href: null }} />
        <Tabs.Screen name="(screens)/loc-lopud" options={{ href: null }} />
        <Tabs.Screen name="(screens)/loc-sipan" options={{ href: null }} />
      </Tabs>
    </GradientBackground>
  );
}
