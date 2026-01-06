// File: src/pages/listing/header/ListingHeader.tsx
// Placeholder for ListingHeader component

import React from 'react';
import { Text, View } from 'react-native';
import type { ListingHeaderProps } from '../types';

export default function ListingHeader({
  title,
  listingId,
  scrollY,
}: ListingHeaderProps) {
  return (
    <View>
      <Text>ListingHeader Placeholder - {title}</Text>
    </View>
  );
}
