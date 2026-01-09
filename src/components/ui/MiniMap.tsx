// src/components/ui/MiniMap.tsx
import React, { useRef } from 'react';
import { View, StyleSheet, Pressable, Platform, Linking, Text } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

// Only use native maps on iOS, static map on Android
let MapView: any = null;
if (Platform.OS === 'ios') {
  try {
    const { AppleMaps } = require('expo-maps');
    MapView = AppleMaps.View;
  } catch (error) {
    console.log('Maps not available:', error);
  }
}

type Props = {
  latitude: number;
  longitude: number;
  title?: string;
  theme: any;
  onOpenFullScreen: () => void;
};

export default function MiniMap({
  latitude,
  longitude,
  title,
  theme,
  onOpenFullScreen,
}: Props) {
  const mapRef = useRef<any>(null);

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta * 0.5,
        longitudeDelta: initialRegion.longitudeDelta * 0.5,
      });
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...initialRegion,
        latitudeDelta: initialRegion.latitudeDelta * 2,
        longitudeDelta: initialRegion.longitudeDelta * 2,
      });
    }
  };

  const openExternalMaps = () => {
    const lat = latitude;
    const lng = longitude;

    const googleURL = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
    const appleURL = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    const webURL = `https://maps.google.com/?q=${lat},${lng}`;

    if (Platform.OS === 'ios') {
      Linking.canOpenURL('comgooglemaps://').then((supported) => {
        if (supported) Linking.openURL(googleURL);
        else Linking.openURL(appleURL);
      });
    } else {
      Linking.openURL(webURL);
    }
  };

  // If MapView is not available (Android), show static map
  if (!MapView) {
    const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=15&size=600x400&markers=${latitude},${longitude},red-pushpin`;
    
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
        <Image
          source={{ uri: staticMapUrl }}
          style={styles.map}
          resizeMode="cover"
        />
        
        {/* Marker overlay */}
        <View style={styles.markerOverlay}>
          <Feather name="map-pin" size={32} color="#FF0000" />
        </View>
        
        {/* Take me there button */}
        <Pressable
          onPress={openExternalMaps}
          style={[styles.takeMeBtn, { backgroundColor: theme.button }]}
        >
          <Feather name="navigation" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            Open in Maps
          </Text>
        </Pressable>
      </View>
    );
  }

  // Show embedded map (iOS and Android if available)
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        cameraPosition={{
          coordinates: { latitude, longitude },
          zoom: 14,
        }}
        markers={[
          {
            coordinates: { latitude, longitude },
            title: title || '',
          },
        ]}
        properties={Platform.OS === 'ios' ? {
          mapType: 'standard',
        } : undefined}
        uiSettings={{
          compassEnabled: false,
          myLocationButtonEnabled: false,
          scaleBarEnabled: false,
        }}
      />

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <Pressable
          onPress={zoomIn}
          style={[styles.zoomBtn, { backgroundColor: theme.background }]}
        >
          <Feather name="plus" size={20} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={zoomOut}
          style={[styles.zoomBtn, { backgroundColor: theme.background }]}
        >
          <Feather name="minus" size={20} color={theme.text} />
        </Pressable>
      </View>

      {/* Fullscreen button */}
      <Pressable
        onPress={onOpenFullScreen}
        style={[styles.fullBtn, { backgroundColor: theme.button }]}
      >
        <Feather name="maximize" size={18} color="#fff" />
      </Pressable>

      {/* Take me there */}
      <Pressable
        onPress={openExternalMaps}
        style={[styles.takeMeBtn, { backgroundColor: theme.button }]}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>
          Take Me There
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#E5E5EA',
  },
  map: { 
    width: '100%', 
    height: '100%',
    flex: 1,
  },

  // Android-specific styles
  androidContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  androidContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  androidTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  androidCoords: {
    fontSize: 13,
    marginTop: 4,
  },

  zoomControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 8,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullBtn: {
    position: 'absolute',
    right: 10,
    bottom: 60,
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  takeMeBtn: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  markerOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
});
