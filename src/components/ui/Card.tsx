// File: src/components/ui/Card.tsx
// Reusable card wrapper component for listing detail sections

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  visible?: boolean;
}

/**
 * Card wrapper component for listing detail sections
 * Provides consistent styling and conditional rendering
 */
export function Card({ children, style, visible = true }: CardProps) {
  if (!visible) return null;

  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 0.5,
  },
});

export default Card;
