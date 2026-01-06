// File: src/pages/listing/content/ListingTags.tsx
// Placeholder for ListingTags component

import React from 'react';
import { Text, View } from 'react-native';
import type { TagsProps } from '../types';

export default function ListingTags({ tags }: TagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <View>
      <Text>ListingTags Placeholder - {tags.length} tags</Text>
    </View>
  );
}
