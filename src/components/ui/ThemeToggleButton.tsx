// components/ui/ThemeToggleButton.tsx
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import TouchableHaptic from './TouchableHaptic';
import { useTheme } from '@/theme/ThemeProvider';

export default function ThemeToggleButton() {
  const { theme, effectiveMode, toggle } = useTheme();

  return (
    <TouchableHaptic
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        backgroundColor: theme.cardBackground,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Feather name={effectiveMode === 'dark' ? 'sun' : 'moon'} size={18} color={theme.button} />
      </View>
    </TouchableHaptic>
  );
}