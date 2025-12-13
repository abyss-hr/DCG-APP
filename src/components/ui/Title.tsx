// components/ui/Title.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { typography } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  theme: ColorTheme;
  right?: React.ReactNode;
};

export default function Title({ title, subtitle, theme, right }: Props) {
  return (
    <View style={styles.container}>
      {!!subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: typography.homeSubtitle.fontSize,
              lineHeight: typography.homeSubtitle.lineHeight,
              fontWeight: typography.homeSubtitle.fontWeight,
              color: theme.subtitle,
            },
          ]}
        >
          {subtitle}
        </Text>
      )}

      <View style={styles.row}>
        <Text
          style={[
            {
              fontSize: typography.homeTitle.fontSize,
              lineHeight: typography.homeTitle.lineHeight,
              fontWeight: typography.homeTitle.fontWeight,
              color: theme.title,
            },
          ]}
        >
          {title}
        </Text>

        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 12, paddingBottom: 2 },
  subtitle: { paddingLeft: 4, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});
