'use client';

import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, typography } from '@/theme';
import { GradientBackground } from '@/theme/GradientBackground';
import UniversalHeader, { HEADER_BODY } from '@/components/ui/UniversalHeader';

/**
 * 🧪 Basic Gradient Test Page
 * Used to test the theme gradient background and header behavior.
 */
export default function TestPage() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const contentPadTop = HEADER_BODY + insets.top + 16;

  return (
    <GradientBackground>
      {/* 🌈 Themed Universal Header */}
      <UniversalHeader
        title="Experience"
        scrollY={scrollY}
        left={{ icon: 'home', autoBack: true }}
        rightIcons={[{ type: 'themeToggle' }]}
      />

      {/* 🧱 Content Area */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 48,
          paddingHorizontal: 16,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.section}>
          <Text
            style={{
              color: theme.title,
              fontSize: 24,
              fontWeight: '700',
              marginBottom: 12,
            }}
          >
            Experience page
          </Text>

          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            This page uses your global{' '}
            <Text style={{ fontWeight: '700', color: theme.title }}>
              GradientBackground
            </Text>{' '}
            component. It should fade smoothly when switching between light and dark modes,
            using the 4-color gradient defined in your theme.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={{ color: theme.subtitle }}>
            Try scrolling, toggling theme, or adding your own components here.
          </Text>
        </View>
      </Animated.ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
});
