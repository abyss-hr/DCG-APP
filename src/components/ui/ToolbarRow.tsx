// components/ui/ToolbarRow.tsx
import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ChevronDown, Filter } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ColorTheme } from '@/theme/colors';
import { typography, AppIcons } from '@/theme';

type Props = {
  theme: ColorTheme;
  count: number;
  layout: 'list' | 'grid';
  onToggleLayout: () => void;

  // optional filter button (only renders if provided)
  onOpenFilter?: () => void;
  filterLabel?: string;
};

export default function ToolbarRow({
  theme,
  count,
  layout,
  onToggleLayout,
  onOpenFilter,
  filterLabel,
}: Props) {
  const ZoomIcon = layout === 'list' ? AppIcons.zoomIn : AppIcons.zoomOut;

  return (
    <View style={[styles.toolbar, { borderColor: theme.cardBorder }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {onOpenFilter ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onOpenFilter();
            }}
            style={[
              styles.filterBtn,
              { borderColor: theme.border, backgroundColor: theme.transparent },
            ]}
            accessibilityRole="button"
          >
            <Filter size={18} color={theme.button} />
            <Text style={{ marginLeft: 6, color: theme.text, fontSize: typography.button.fontSize }}>
              {filterLabel ?? 'Filter'}
            </Text>
            <ChevronDown size={18} color={theme.subtitle} style={{ marginLeft: 6 }} />
          </Pressable>
        ) : null}

        <Text style={{ marginLeft: 10, color: theme.title, fontSize: typography.subtitle.fontSize }}>
          {count}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onToggleLayout();
        }}
        accessibilityRole="button"
        style={[
          styles.iconBtn,
          { borderColor: theme.border, backgroundColor: theme.transparent },
        ]}
      >
        <ZoomIcon size={20} color={theme.button} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    // paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    height:40,
  },
  iconBtn: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
});