// app/(drawer)/(listing)/map.tsx
// Fullscreen Map Page with expo-maps

import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { GoogleMaps, AppleMaps } from 'expo-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useLocation } from '@/components/context/LocationContext';

const MapView = Platform.OS === 'ios' ? AppleMaps.View : GoogleMaps.View;

export default function FullscreenMap() {
  const router = useRouter();
  const { lat, lng, title } = useLocalSearchParams();
  const { userLocation } = useLocation();

  const latitude = Number(lat);
  const longitude = Number(lng);

  const hasCoords = latitude && longitude;

  const initialRegion = useMemo(
    () => ({
      latitude: latitude || 42.65,
      longitude: longitude || 18.09,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [latitude, longitude]
  );

  const markers = useMemo(() => {
    const markerList: any[] = [];
    
    if (hasCoords) {
      markerList.push({
        coordinates: { latitude, longitude },
        title: (title as string) || '',
      });
    }
    
    if (userLocation) {
      markerList.push({
        coordinates: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        title: 'You are here',
      });
    }
    
    return markerList;
  }, [hasCoords, latitude, longitude, userLocation, title]);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={StyleSheet.absoluteFill}
        cameraPosition={{
          coordinates: { latitude, longitude },
          zoom: 15,
        }}
        markers={markers}
      />

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Feather name="x" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      {title && (
        <View style={styles.titleWrapper}>
          <Text 
            style={styles.titleText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 10,
    borderRadius: 50,
  },

  titleWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },

  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
