// src/components/modals/settings/SectionHeader.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: theme.subtitle }
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  text: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
