// app/(drawer)/(listing)/map.tsx
// Fullscreen Interactive Map — expo-maps (TYPE SAFE, NO BULLSHIT)

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import type { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types';
import type { GoogleMapsMarker } from 'expo-maps/build/google/GoogleMaps.types';
import * as Location from 'expo-location';
import { X } from 'lucide-react-native';

import { useListings } from '@/database/useListings';
import { useTheme } from '@/theme';

/* ---------------- helpers ---------------- */

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

/* ---------------- screen ---------------- */

export default function MapScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  // Optional focus coordinates
  const focusLat = params.latitude ? Number(params.latitude) : null;
  const focusLng = params.longitude ? Number(params.longitude) : null;

  const hasFocus =
    isNumber(focusLat) && isNumber(focusLng);

  // Ask permission ONLY so native map may show blue dot if supported
  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  const { data: listings = [] } = useListings();

  // Camera is ALWAYS valid
  const cameraPosition = useMemo(() => {
    if (hasFocus) {
      return {
        coordinates: {
          latitude: focusLat!,
          longitude: focusLng!,
        },
        zoom: 15,
      };
    }

    return {
      coordinates: {
        latitude: 42.6507,
        longitude: 18.0944,
      },
      zoom: 12,
    };
  }, [hasFocus, focusLat, focusLng]);

  // Apple markers
  const appleMarkers = useMemo<AppleMapsMarker[]>(() => {
    return listings.flatMap((l) => {
      const lat = l.coordinates?.lat;
      const lng = l.coordinates?.lng;

      if (!isNumber(lat) || !isNumber(lng)) return [];

      return [{
        id: l.id,
        coordinates: { latitude: lat, longitude: lng },
        title: l.title ?? '',
      }];
    });
  }, [listings]);

  // Google markers
  const googleMarkers = useMemo<GoogleMapsMarker[]>(() => {
    return listings.flatMap((l) => {
      const lat = l.coordinates?.lat;
      const lng = l.coordinates?.lng;

      if (!isNumber(lat) || !isNumber(lng)) return [];

      return [{
        id: l.id,
        coordinates: { latitude: lat, longitude: lng },
        title: l.title ?? '',
      }];
    });
  }, [listings]);

  const onMarkerClick = (e: { id?: string }) => {
    if (!e.id) return;
    router.push(`/(drawer)/(listing)/${e.id}`);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          markers={appleMarkers}
          onMarkerClick={onMarkerClick}
        />
      ) : (
        <GoogleMaps.View
          style={styles.map}
          cameraPosition={cameraPosition}
          markers={googleMarkers}
          onMarkerClick={onMarkerClick}
        />
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: theme.button }]}
          onPress={() => router.back()}
        >
          <X size={18} color="#fff" />
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
  },
  closeButton: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
