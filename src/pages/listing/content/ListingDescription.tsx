// File: src/pages/listing/content/ListingDescription.tsx
// Expandable description component with show more/less button

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme, typography } from '@/theme';
import { Card } from '@/components/ui/Card';
import TouchableHaptic from '@/components/ui/TouchableHaptic';
import type { DescriptionProps } from '../types';

export default function ListingDescription({
  description,
  label,
  maxLines = 6,
}: DescriptionProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  // Estimate if text will be truncated (roughly 40 chars per line)
  const estimatedLines = Math.ceil(description.length / 40);
  const hasMore = estimatedLines > maxLines;

  const Icon = expanded ? ChevronUp : ChevronDown;

  return (
    <Card>
      <View style={styles.content}>
        {label && (
          <Text style={[styles.label, typography.button, { color: theme.text }]}>
            {label}
          </Text>
        )}
        
        <Text
          style={[styles.description, typography.body, { color: theme.subtitle }]}
          numberOfLines={expanded ? undefined : maxLines}
        >
          {description}
        </Text>

        {hasMore && (
          <TouchableHaptic
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
            haptic="light"
          >
            <Icon size={18} color={theme.button} strokeWidth={2} />
            <Text style={[styles.expandText, { color: theme.button }]}>
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </TouchableHaptic>
      )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    marginTop: 4,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '200',
  },
});
