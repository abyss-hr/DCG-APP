// Map section with static map preview

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';
import { Navigation, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme';
import { Card } from '@/components/ui/Card';
import StaticMap from '@/components/maps/StaticMap';
import type { MapSectionProps } from '../types';

export default function ListingMapSection({
  latitude,
  longitude,
  title,
}: MapSectionProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [zoom, setZoom] = useState(15);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 10));

  const handleOpenNativeMap = () => {
    const latLng = `${latitude},${longitude}`;
    const label = title;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const handleOpenFullscreenMap = () => {
    router.push({
      pathname: '/(drawer)/(listing)/map',
      params: { latitude, longitude },
    });
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Location
      </Text>

      <Card>
        {/* Static Map Preview */}
        <View style={styles.mapWrapper}>
          <StaticMap
            latitude={latitude}
            longitude={longitude}
            zoom={zoom}
            style={styles.map}
            clickable={false}
          />
          
          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={[styles.zoomButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
              onPress={handleZoomIn}
              activeOpacity={0.7}
            >
              <ZoomIn size={20} color={theme.text} strokeWidth={1.5} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.zoomButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
              onPress={handleZoomOut}
              activeOpacity={0.7}
            >
              <ZoomOut size={20} color={theme.text} strokeWidth={1.5} />
            </TouchableOpacity>

            {/* Fullscreen Map Button */}
            <TouchableOpacity
              style={[styles.zoomButton, { backgroundColor: theme.button, borderColor: theme.button }]}
              onPress={handleOpenFullscreenMap}
              activeOpacity={0.7}
            >
              <Maximize2 size={20} color="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Open Native Maps Button */}
        <TouchableOpacity
          onPress={handleOpenNativeMap}
          style={[styles.button, { backgroundColor: theme.button }]}
        >
          <Navigation size={20} color="#FFFFFF" strokeWidth={1.5} />
          <Text style={styles.buttonText}>
            Open Map & Take Me There
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  mapWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    height: 220,
    borderRadius: 15,
  },
  zoomControls: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
