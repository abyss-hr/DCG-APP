// File: src/pages/listing/content/ListingInfoCard.tsx
// Info card with category, location, price details

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapPin, Tag, DollarSign, Calendar } from 'lucide-react-native';
import { useTheme, typography } from '@/theme';
import { Card } from '@/components/ui/Card';
import type { InfoCardProps } from '../types';

export default function ListingInfoCard({
  categoryName,
  locationMain,
  locationSub,
  priceLevel,
  workingPeriod,
}: InfoCardProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <View style={styles.content}>
        {/* Category */}
        <InfoRow
        icon={<Tag size={18} color={theme.subtitle} />}
        label="Category"
        value={categoryName}
        theme={theme}
      />

      {/* Location */}
      <InfoRow
        icon={<MapPin size={18} color={theme.subtitle} />}
        label="Location"
        value={locationMain}
        theme={theme}
      />

      {/* Sub-location / Area */}
      {locationSub && (
        <InfoRow
          icon={<MapPin size={18} color={theme.subtitle} />}
          label="Area"
          value={locationSub}
          theme={theme}
        />
      )}

      {/* Price Level */}
      {priceLevel && (
        <InfoRow
          icon={<DollarSign size={18} color={theme.subtitle} />}
          label="Price"
          value={priceLevel}
          theme={theme}
        />
      )}

      {/* Working Period */}
      {workingPeriod && (
        <InfoRow
          icon={<Calendar size={18} color={theme.subtitle} />}
          label="Working period"
          value={workingPeriod}
          theme={theme}
        />
      )}
      </View>
    </Card>
  );
}

// Info Row Component
function InfoRow({
  icon,
  label,
  value,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconLabelContainer}>
        {icon}
        <Text style={[styles.label, { color: theme.subtitle }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: theme.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  value: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});
