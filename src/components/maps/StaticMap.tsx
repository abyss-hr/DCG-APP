// src/components/maps/StaticMap.tsx

import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewStyle, StyleProp, Linking } from 'react-native';

type StaticMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;          // 1–18 (roughly)
  style?: StyleProp<ViewStyle>;
  clickable?: boolean;    // open full map on tap
};

const StaticMap: React.FC<StaticMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  style,
  clickable = true,
}) => {
  // Google Maps Static API - more reliable rendering
  const url = useMemo(
    () => {
      // Using Google Maps Static API (free tier: 25,000 requests/day)
      // For production, add your API key: &key=YOUR_API_KEY
      const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
      const params = new URLSearchParams({
        center: `${latitude},${longitude}`,
        zoom: String(zoom),
        size: '600x300',
        markers: `color:red|${latitude},${longitude}`,
        maptype: 'roadmap',
        scale: '2' // Retina quality
      });
      return `${baseUrl}?${params.toString()}`;
    },
    [latitude, longitude, zoom]
  );

  const openFullMap = () => {
    const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;
    Linking.openURL(osmUrl).catch(() => {});
  };

  const content = (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: url }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Optional custom pin overlay */}
      <View style={styles.pinContainer} pointerEvents="none">
        <View style={styles.pin} />
      </View>
    </View>
  );

  if (clickable) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={openFullMap}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#E2E2E2',
  },
  pinContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -6,
    marginTop: -18,
    alignItems: 'center',
  },
  pin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff5555',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});

export default StaticMap;
