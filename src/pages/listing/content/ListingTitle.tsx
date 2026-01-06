// File: src/pages/listing/content/ListingTitle.tsx
// Title component with category icon

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, typography, getLucideIcon } from '@/theme';
import type { TitleProps } from '../types';

export default function ListingTitle({ title, filterMainIcon }: TitleProps) {
  const { theme } = useTheme();
  
  // Show main filter icon from database
  const Icon = filterMainIcon ? getLucideIcon(filterMainIcon) : null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          typography.title,
          { color: theme.text },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon
            size={32}
            color={theme.button}
            strokeWidth={1}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  title: {
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
