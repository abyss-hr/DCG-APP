// app/(drawer)/(tabs)/(screens)/Beach.tsx
'use client';

import React, { useRef } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme, typography } from '@/theme';
import UniversalHeader, { HEADER_BODY } from '@/components/ui/UniversalHeader';
import { GradientBackground } from '@/theme/GradientBackground';

export default function Beach() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const router = useRouter();

  const contentPadTop = HEADER_BODY + insets.top + 16;

  return (
    <GradientBackground>
      <UniversalHeader
        title="Let's eat!"
        scrollY={scrollY}
        // 🏠 Left: go back to home tab
        left={{
          icon: 'home',
          onPress: () => router.replace('/(tabs)/index'),
        }}
        // 🌙 Right: theme toggle + ☰ drawer toggle
        rightIcons={[
          { type: 'themeToggle' },
          {
            type: 'icon',
            icon: 'menu',
            onPress: () =>
              navigation.dispatch(DrawerActions.toggleDrawer()),
          },
        ]}
      />

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingHorizontal: 16,
          paddingBottom: 48,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Text
          style={{
            color: theme.title,
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 12,
          }}
        >
          Food and drink 🌊
        </Text>

        <Text style={{ color: theme.text, lineHeight: 22 }}>
          This page demonstrates how to use the same gradient UniversalHeader
          but with a Home icon, Theme toggle, and Drawer toggle. It behaves
          consistently with the rest of your app.
        </Text>
      </Animated.ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
});
