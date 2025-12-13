// Settings Screen - User Preferences & App Configuration
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, typography } from '@/theme';
import { GradientBackground } from '@/theme/GradientBackground';
import UniversalHeader, { getHeaderHeights } from '@/components/ui/UniversalHeader';
import { useOffline } from '@/components/context/OfflineContext';
import { useLocation } from '@/components/context/LocationContext';

const SCREEN_PAD = 12;
const ZOOM_STORAGE_KEY = '@dcg_explore_zoom';

type ThemeMode = 'system' | 'light' | 'dark';

export default function SettingsScreen() {
  const { theme, mode, effectiveMode, setMode } = useTheme();
  const { 
    offlineEnabled, 
    enableOfflineMode, 
    disableOfflineMode, 
    clearCache: clearOfflineCache,
    cachedListingsCount,
    cacheTimestamp,
    isOnline,
    cacheSize,
    refreshCacheSize
  } = useOffline();
  const {
    locationEnabled,
    permissionStatus,
    userLocation,
    isLoading: locationLoading,
    enableLocation,
    disableLocation,
    openSettings: openLocationSettings,
  } = useLocation();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { headerTotal } = getHeaderHeights(insets.top);
  const contentPadTop = headerTotal + SCREEN_PAD;

  // Load saved zoom preference
  const [zoomMode, setZoomMode] = React.useState<'list' | 'grid'>('grid');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  React.useEffect(() => {
    loadSettings();
    refreshCacheSize(); // Load cache size on mount
  }, []);

  // Debug: Log theme changes
  React.useEffect(() => {
    console.log('[Settings] Theme changed - mode:', mode, 'effectiveMode:', effectiveMode, 'theme.mode:', theme.mode);
  }, [mode, effectiveMode, theme.mode]);

  const loadSettings = async () => {
    try {
      const savedZoom = await AsyncStorage.getItem(ZOOM_STORAGE_KEY);
      if (savedZoom === 'list' || savedZoom === 'grid') setZoomMode(savedZoom);
    } catch {}
  };

  const handleThemeChange = async (newMode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setMode(newMode);
  };

  const handleZoomChange = async (newZoom: 'list' | 'grid') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setZoomMode(newZoom);
    try {
      await AsyncStorage.setItem(ZOOM_STORAGE_KEY, newZoom);
    } catch {}
  };

  const handleClearCache = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (cachedListingsCount === 0 && cacheSize === '0 B') {
      Alert.alert('No Cache', 'There is no cached data to clear.');
      return;
    }
    
    Alert.alert(
      'Clear Cache',
      `This will clear ${cachedListingsCount} cached listings and ${cacheSize} of data. The app will re-download content on next use.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearOfflineCache();
              await refreshCacheSize();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  // Section Header Component
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.subtitle }]}>
        {title}
      </Text>
    </View>
  );

  // Setting Item with Toggle
  const SettingToggle = ({
    icon,
    title,
    description,
    value,
    onValueChange,
    color,
  }: {
    icon: string;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    color?: string;
  }) => (
    <View
      style={[
        styles.settingItem,
        {
          backgroundColor:
            theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderColor:
            theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
      ]}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: (color || theme.button) + '20' },
          ]}
        >
          <Feather name={icon as any} size={20} color={color || theme.button} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.subtitle }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange(val);
        }}
        trackColor={{ false: theme.border, true: theme.button + '80' }}
        thumbColor={value ? theme.button : theme.subtitle}
        ios_backgroundColor={theme.border}
      />
    </View>
  );

  // Setting Item with Navigation/Action
  const SettingButton = ({
    icon,
    title,
    description,
    onPress,
    color,
    rightText,
  }: {
    icon: string;
    title: string;
    description?: string;
    onPress: () => void;
    color?: string;
    rightText?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor:
            theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderColor:
            theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.settingIcon,
            { backgroundColor: (color || theme.button) + '20' },
          ]}
        >
          <Feather name={icon as any} size={20} color={color || theme.button} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.subtitle }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightText && (
          <Text style={[styles.settingRightText, { color: theme.subtitle }]}>
            {rightText}
          </Text>
        )}
        <Feather name="chevron-right" size={20} color={theme.subtitle} />
      </View>
    </TouchableOpacity>
  );

  // Theme Selection Buttons
  const ThemeSelector = () => (
    <View style={styles.themeSelectorContainer}>
      {(['system', 'light', 'dark'] as ThemeMode[]).map((themeOption) => (
        <TouchableOpacity
          key={themeOption}
          style={[
            styles.themeOption,
            {
              backgroundColor:
                mode === themeOption
                  ? theme.button + '20'
                  : theme.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
              borderColor:
                mode === themeOption
                  ? theme.button
                  : theme.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)',
              borderWidth: mode === themeOption ? 2 : 1,
            },
          ]}
          onPress={() => handleThemeChange(themeOption)}
          activeOpacity={0.7}
        >
          <Feather
            name={
              themeOption === 'system'
                ? 'smartphone'
                : themeOption === 'light'
                ? 'sun'
                : 'moon'
            }
            size={24}
            color={mode === themeOption ? theme.button : theme.subtitle}
          />
          <Text
            style={[
              styles.themeOptionText,
              {
                color: mode === themeOption ? theme.button : theme.text,
                fontWeight: mode === themeOption ? '600' : '400',
              },
            ]}
          >
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Card Zoom Selection Buttons
  const ZoomSelector = () => (
    <View style={styles.zoomSelectorContainer}>
      {(['grid', 'list'] as const).map((zoom) => (
        <TouchableOpacity
          key={zoom}
          style={[
            styles.zoomOption,
            {
              backgroundColor:
                zoomMode === zoom
                  ? theme.button + '20'
                  : theme.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
              borderColor:
                zoomMode === zoom
                  ? theme.button
                  : theme.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)',
              borderWidth: zoomMode === zoom ? 2 : 1,
            },
          ]}
          onPress={() => handleZoomChange(zoom)}
          activeOpacity={0.7}
        >
          <Feather
            name={zoom === 'grid' ? 'grid' : 'list'}
            size={24}
            color={zoomMode === zoom ? theme.button : theme.subtitle}
          />
          <Text
            style={[
              styles.zoomOptionText,
              {
                color: zoomMode === zoom ? theme.button : theme.text,
                fontWeight: zoomMode === zoom ? '600' : '400',
              },
            ]}
          >
            {zoom === 'grid' ? 'Zoomed' : 'List'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <GradientBackground>
      <UniversalHeader
        title="Settings"
        scrollY={scrollY}
        left={{ icon: 'chevron-left', autoBack: true }}
        rightIcons={[{ type: 'themeToggle' }]}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingTop: contentPadTop,
          paddingBottom: 24,
          paddingHorizontal: SCREEN_PAD,
        }}
      >
        {/* Appearance Section */}
        <SectionHeader title="APPEARANCE" />
        <View style={styles.section}>
          <Text style={[styles.sectionDescription, { color: theme.subtitle }]}>
            Choose your preferred theme
          </Text>
          <ThemeSelector />
          {/* Debug info */}
          <View style={{ marginTop: 12, padding: 12, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 8 }}>
            <Text style={[styles.sectionDescription, { color: theme.subtitle, fontSize: 11 }]}>
              Debug: mode={mode} | effective={effectiveMode}
            </Text>
          </View>
        </View>

        {/* Display Section */}
        <SectionHeader title="DISPLAY" />
        <View style={styles.section}>
          <Text style={[styles.sectionDescription, { color: theme.subtitle }]}>
            Adjust card display style
          </Text>
          <ZoomSelector />
        </View>

        {/* Privacy & Permissions Section */}
        <SectionHeader title="PRIVACY & PERMISSIONS" />
        <View style={styles.section}>
          <SettingToggle
            icon="map-pin"
            title="Location Services"
            description={
              permissionStatus === 'granted' && userLocation
                ? `Location enabled • ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                : permissionStatus === 'blocked'
                ? 'Permission blocked - Open Settings to enable'
                : permissionStatus === 'denied'
                ? 'Permission denied - Toggle to request again'
                : 'Enable to see nearby listings and distances'
            }
            value={locationEnabled}
            onValueChange={(value) => {
              if (value) {
                enableLocation();
              } else {
                disableLocation();
              }
            }}
            color="#4CAF50"
          />
          <SettingToggle
            icon="bell"
            title="Notifications"
            description="Get updates about new listings and promotions"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            color="#FF9800"
          />
        </View>

        {/* Data & Storage Section */}
        <SectionHeader title="DATA & STORAGE" />
        <View style={styles.section}>
          <SettingToggle
            icon="wifi-off"
            title="Offline Mode"
            description={
              offlineEnabled && cachedListingsCount > 0
                ? `${cachedListingsCount} listings cached • ${isOnline ? 'Online' : 'Offline'}`
                : 'Cache listings for offline access'
            }
            value={offlineEnabled}
            onValueChange={(value) => {
              if (value) {
                enableOfflineMode();
              } else {
                disableOfflineMode();
              }
            }}
            color="#9C27B0"
          />
          <SettingButton
            icon="trash-2"
            title="Clear Cache"
            description={
              cachedListingsCount > 0 || cacheSize !== '0 B'
                ? `${cachedListingsCount} listings • ${cacheSize} used`
                : 'No cached data'
            }
            onPress={handleClearCache}
            color="#F44336"
            rightText={cacheSize}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="ABOUT" />
        <View style={styles.section}>
          <SettingButton
            icon="info"
            title="App Version"
            description="DCG - Dubrovnik City Guide"
            onPress={() => {}}
            rightText="1.0.0"
          />
          <SettingButton
            icon="file-text"
            title="Terms & Conditions"
            description="Read our terms of service"
            onPress={() => {}}
          />
          <SettingButton
            icon="shield"
            title="Privacy Policy"
            description="Learn how we protect your data"
            onPress={() => {}}
          />
          <SettingButton
            icon="help-circle"
            title="Help & Support"
            description="Get help or contact support"
            onPress={() => {}}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.subtitle }]}>
            Made with ❤️ in Dubrovnik
          </Text>
          <Text style={[styles.footerText, { color: theme.subtitle }]}>
            © 2025 DCG App
          </Text>
        </View>
      </Animated.ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 4,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    gap: 12,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingRightText: {
    fontSize: 14,
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
  },
  zoomSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  zoomOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  zoomOptionText: {
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});
