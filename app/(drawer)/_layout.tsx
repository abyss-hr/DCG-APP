// app/(drawer)/_layout.tsx
import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, typography } from '@/theme';
import { GradientBackground } from '@/theme/GradientBackground';
import SettingsModal from '@/components/modals/settings/SettingsModal';

function CustomDrawerContent(props: any) {
  const { theme } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const doHaptic = () => Haptics.selectionAsync();

  // 🎨 Shared visual style
  const ICON_SIZE = 22;
  const TEXT_STYLE = { fontSize: 15, fontWeight: '500' as const, color: theme.text };

  return (
    <GradientBackground>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        {/* Header */}
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme.title, marginBottom: 8, fontSize: typography.title.fontSize, fontWeight: '700' }}>
            Menu
          </Text>
        </View>

        {/* Drawer Items */}
        <DrawerItem
          label={() => <Text style={TEXT_STYLE}>Home</Text>}
          icon={() => <Feather name="home" size={ICON_SIZE} color={theme.button} />}
          onPress={() => {
            doHaptic();
            props.navigation.navigate('(tabs)', { screen: 'index' });
          }}
        />

        <DrawerItem
          label={() => <Text style={TEXT_STYLE}>Popular</Text>}
          icon={() => <Feather name="coffee" size={ICON_SIZE} color={theme.button} />}
          onPress={() => {
            doHaptic();
            props.navigation.navigate('(drawer)', { screen: 'popular' });
          }}
        />

        <DrawerItem
          label={() => <Text style={TEXT_STYLE}>Beach</Text>}
          icon={() => <Feather name="umbrella" size={ICON_SIZE} color={theme.button} />}
          onPress={() => {
            doHaptic();
            props.navigation.navigate('(tabs)', {
              screen: '(screens)/Beach',
            });
          }}
        />

        <DrawerItem
          label={() => <Text style={TEXT_STYLE}>Dubrovnik City</Text>}
          icon={() => <Feather name="map-pin" size={ICON_SIZE} color={theme.button} />}
          onPress={() => {
            doHaptic();
            props.navigation.navigate('(tabs)', {
              screen: '(screens)/DubrovnikCity',
            });
          }}
        />

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', marginVertical: 8, marginHorizontal: 16 }} />

        {/* Settings - Opens Modal */}
        <DrawerItem
          label={() => <Text style={TEXT_STYLE}>Settings</Text>}
          icon={() => <Feather name="settings" size={ICON_SIZE} color={theme.button} />}
          onPress={() => {
            doHaptic();
            props.navigation.closeDrawer();
            setTimeout(() => setSettingsVisible(true), 300);
          }}
        />

        {/* Spacer to push footer to bottom */}
        <View style={{ flex: 1 }} />

        {/* Made with Love Footer */}
        <View style={{ padding: 16, alignItems: 'center', gap: 4, paddingBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: theme.subtitle }}>
            Made with ❤️ in Dubrovnik
          </Text>
          <Text style={{ fontSize: 11, color: theme.subtitle, opacity: 0.7 }}>
            © 2025 DCG App
          </Text>
        </View>
      </DrawerContentScrollView>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </GradientBackground>
  );
}

export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { backgroundColor: 'transparent' }, // keep gradient visible
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
