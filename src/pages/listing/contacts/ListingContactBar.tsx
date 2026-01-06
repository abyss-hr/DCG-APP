// Bottom contact bar with Phone, WhatsApp, Email buttons

import React from 'react';
import { Linking, StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Mail } from 'lucide-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/theme';
import { lightTheme, darkTheme } from '@/theme/colors';
import TouchableHaptic from '@/components/ui/TouchableHaptic';
import type { ContactBarProps } from '../types';
import type { ColorValue } from 'react-native';

export default function ListingContactBar({
  phone,
  whatsapp,
  email,
  latitude,
  longitude,
  title,
}: ContactBarProps) {
  const { theme } = useTheme();

  // Don't render if no contact methods
  if (!phone && !whatsapp && !email && !(latitude && longitude)) return null;

  const hasValidGradient =
    Array.isArray(theme?.tabGradient) &&
    theme.tabGradient.length >= 2 &&
    theme.tabGradient.every(Boolean);

  const gradientColors: [ColorValue, ColorValue] = hasValidGradient
    ? theme.tabGradient
    : theme.mode === 'dark'
      ? darkTheme.tabGradient
      : lightTheme.tabGradient;

  return (
    <View style={styles.contactBarWrapper}>
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]] as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { opacity: theme.tabOpacity }]}
      />
      <View
        style={[
          styles.contactBar,
          {
            borderTopColor:
              theme.mode === 'dark'
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(0,0,0,0.08)',
          },
        ]}
      >
        {phone && (
          <ContactButton
            icon={<Phone size={24} color={theme.tabIconActive} strokeWidth={1.5} />}
            label="Call"
            color={theme.tabIconActive}
            onPress={() => Linking.openURL(`tel:${phone}`)}
          />
        )}
        {whatsapp && (
          <ContactButton
            icon={
              <MaterialCommunityIcons
                name="whatsapp"
                size={26}
                color={theme.tabIconActive}
              />
            }
            label="WhatsApp"
            color={theme.tabIconActive}
            onPress={() => Linking.openURL(`https://wa.me/${whatsapp}`)}
          />
        )}
        {email && (
          <ContactButton
            icon={<Mail size={24} color={theme.tabIconActive} strokeWidth={1.5} />}
            label="Email"
            color={theme.tabIconActive}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          />
        )}
        {latitude && longitude && (
          <ContactButton
            icon={<MaterialCommunityIcons name="map-marker" size={26} color={theme.tabIconActive} />}
            label="Map"
            color={theme.tabIconActive}
            onPress={() => {
              // Open native maps app with coordinates
              const lat = latitude;
              const lng = longitude;
              const label = title || 'Location';
              const url =
                Platform.OS === 'ios'
                  ? `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
                  : `geo:${lat},${lng}?q=${encodeURIComponent(label)}`;
              Linking.openURL(url);
            }}
          />
        )}
      </View>
    </View>
  );
}

// Contact Button Component
function ContactButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableHaptic onPress={onPress} style={styles.contactBtn} haptic="selection">
      {icon}
      <Text style={[styles.contactLabel, { color }]}>{label}</Text>
    </TouchableHaptic>
  );
}

const styles = StyleSheet.create({
  contactBarWrapper: {
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contactBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 66,
    paddingBottom: 6,
    borderTopWidth: 0.5,
  },
  contactBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
