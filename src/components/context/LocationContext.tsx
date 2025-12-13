// LocationContext.tsx
// Manages location permissions and user coordinates

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const LOCATION_ENABLED_KEY = '@dcg_location_enabled';

type LocationPermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
} | null;

type LocationContextValue = {
  locationEnabled: boolean;
  permissionStatus: LocationPermissionStatus;
  userLocation: UserLocation;
  isLoading: boolean;
  requestLocationPermission: () => Promise<boolean>;
  enableLocation: () => Promise<void>;
  disableLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  openSettings: () => void;
};

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('undetermined');
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load location preference and check permissions on mount
  useEffect(() => {
    loadLocationPreference();
    checkPermissionStatus();
  }, []);

  // If location is enabled and permission granted, get location
  useEffect(() => {
    if (locationEnabled && permissionStatus === 'granted') {
      getCurrentLocation();
    }
  }, [locationEnabled, permissionStatus]);

  const loadLocationPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(LOCATION_ENABLED_KEY);
      setLocationEnabled(saved === 'true');
    } catch (error) {
      console.error('Error loading location preference:', error);
    }
  };

  const checkPermissionStatus = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionStatus('granted');
      } else if (status === 'denied') {
        // Check if they can still request permission
        const { canAskAgain } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(canAskAgain ? 'denied' : 'blocked');
      } else {
        setPermissionStatus('undetermined');
      }
    } catch (error) {
      console.error('Error checking permission status:', error);
      setPermissionStatus('undetermined');
    }
  };

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // First check current status
      const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      
      if (currentStatus === 'granted') {
        setPermissionStatus('granted');
        return true;
      }
      
      // Request permission
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        setPermissionStatus('granted');
        return true;
      } else {
        setPermissionStatus(canAskAgain ? 'denied' : 'blocked');
        
        if (!canAskAgain) {
          // Permission is permanently blocked
          Alert.alert(
            'Location Permission Blocked',
            'Location access is permanently denied. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openSettings },
            ]
          );
        }
        
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const enableLocation = useCallback(async () => {
    try {
      // Request permission if not granted
      if (permissionStatus !== 'granted') {
        const granted = await requestLocationPermission();
        if (!granted) {
          return;
        }
      }
      
      // Save preference
      await AsyncStorage.setItem(LOCATION_ENABLED_KEY, 'true');
      setLocationEnabled(true);
      
      // Get current location
      await getCurrentLocation();
    } catch (error) {
      console.error('Error enabling location:', error);
      Alert.alert('Error', 'Failed to enable location services');
    }
  }, [permissionStatus, requestLocationPermission]);

  const disableLocation = useCallback(async () => {
    try {
      await AsyncStorage.setItem(LOCATION_ENABLED_KEY, 'false');
      setLocationEnabled(false);
      setUserLocation(null);
    } catch (error) {
      console.error('Error disabling location:', error);
      Alert.alert('Error', 'Failed to disable location services');
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    if (permissionStatus === 'granted' && locationEnabled) {
      await getCurrentLocation();
    }
  }, [permissionStatus, locationEnabled]);

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Location.requestForegroundPermissionsAsync(); // This will show the permission dialog with "Settings" option
    } else {
      Alert.alert(
        'Open Settings',
        'Please enable location permission in your device settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const value: LocationContextValue = {
    locationEnabled,
    permissionStatus,
    userLocation,
    isLoading,
    requestLocationPermission,
    enableLocation,
    disableLocation,
    refreshLocation,
    openSettings,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
