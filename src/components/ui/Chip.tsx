// components/ui/Chip.tsx
import React from 'react';
import { Pressable, StyleSheet, ViewStyle, Text } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { typography } from '@/theme';

type Variant = 'default' | 'clear';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  theme: ColorTheme;
  style?: ViewStyle;
  variant?: Variant;
};

export default function Chip({
  label,
  selected,
  onPress,
  theme,
  style,
  variant = 'default',
}: Props) {
  if (variant === 'clear') {
    // “Clear all” visual
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.chip,
          {
            backgroundColor: 'transparent',
            borderColor: theme.border,
          },
          style,
        ]}
      >
        <Text style={{ color: theme.button, fontSize: typography.button.fontSize }}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.button : theme.background,
          borderColor: selected ? theme.button : theme.border,
        },
        style,
      ]}
    >
      <Text
        style={{ color: selected ? theme.button : theme.text, fontSize: typography.button.fontSize }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
}); 