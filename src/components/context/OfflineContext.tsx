// OfflineContext.tsx
// Manages network state and offline data caching

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getTotalCacheSize, formatBytes, clearAllCache } from '@/utils/storageUtils';

const OFFLINE_ENABLED_KEY = '@dcg_offline_enabled';
const CACHED_LISTINGS_KEY = '@dcg_cached_listings';
const CACHE_TIMESTAMP_KEY = '@dcg_cache_timestamp';

type NetworkState = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
};

type OfflineContextValue = {
  isOnline: boolean;
  offlineEnabled: boolean;
  networkState: NetworkState;
  cachedListingsCount: number;
  cacheTimestamp: string | null;
  cacheSize: string;
  cacheSizeBytes: number;
  enableOfflineMode: () => Promise<void>;
  disableOfflineMode: () => Promise<void>;
  cacheListings: (listings: any[]) => Promise<void>;
  getCachedListings: () => Promise<any[]>;
  clearCache: () => Promise<void>;
  refreshCache: () => Promise<void>;
  refreshCacheSize: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [cachedListingsCount, setCachedListingsCount] = useState(0);
  const [cacheTimestamp, setCacheTimestamp] = useState<string | null>(null);
  const [cacheSizeBytes, setCacheSizeBytes] = useState(0);
  const [cacheSize, setCacheSize] = useState('0 B');

  // Determine if we're truly online (both connected and internet reachable)
  const isOnline = networkState.isConnected === true && 
                   networkState.isInternetReachable !== false;

  // Load offline mode preference on mount
  useEffect(() => {
    loadOfflinePreference();
    loadCacheInfo();
    loadCacheSize();
  }, []);

  // Subscribe to network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });

      // Auto-cache when coming back online if offline mode is enabled
      if (state.isConnected && offlineEnabled) {
        // Trigger cache refresh in background
        console.log('Back online - consider refreshing cache');
      }
    });

    return () => unsubscribe();
  }, [offlineEnabled]);

  const loadOfflinePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(OFFLINE_ENABLED_KEY);
      setOfflineEnabled(saved === 'true');
    } catch (error) {
      console.error('Error loading offline preference:', error);
    }
  };

  const loadCacheInfo = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHED_LISTINGS_KEY);
      const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached) {
        const listings = JSON.parse(cached);
        setCachedListingsCount(listings.length);
      }
      
      if (timestamp) {
        setCacheTimestamp(timestamp);
      }
    } catch (error) {
      console.error('Error loading cache info:', error);
    }
  };

  const loadCacheSize = async () => {
    try {
      const size = await getTotalCacheSize();
      setCacheSizeBytes(size);
      setCacheSize(formatBytes(size));
    } catch (error) {
      console.error('Error loading cache size:', error);
    }
  };

  const refreshCacheSize = useCallback(async () => {
    await loadCacheSize();
  }, []);

  const enableOfflineMode = useCallback(async () => {
    try {
      await AsyncStorage.setItem(OFFLINE_ENABLED_KEY, 'true');
      setOfflineEnabled(true);
      
      // Show info about caching
      if (cachedListingsCount === 0) {
        Alert.alert(
          'Offline Mode Enabled',
          'Data will be cached automatically when you browse listings. Make sure to explore content while online to cache it for offline use.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error enabling offline mode:', error);
      Alert.alert('Error', 'Failed to enable offline mode');
    }
  }, [cachedListingsCount]);

  const disableOfflineMode = useCallback(async () => {
    try {
      await AsyncStorage.setItem(OFFLINE_ENABLED_KEY, 'false');
      setOfflineEnabled(false);
    } catch (error) {
      console.error('Error disabling offline mode:', error);
      Alert.alert('Error', 'Failed to disable offline mode');
    }
  }, []);

  const cacheListings = useCallback(async (listings: any[]) => {
    if (!offlineEnabled) return;
    
    try {
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(CACHED_LISTINGS_KEY, JSON.stringify(listings));
      await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp);
      
      setCachedListingsCount(listings.length);
      setCacheTimestamp(timestamp);
      
      console.log(`Cached ${listings.length} listings for offline use`);
    } catch (error) {
      console.error('Error caching listings:', error);
    }
  }, [offlineEnabled]);

  const getCachedListings = useCallback(async (): Promise<any[]> => {
    try {
      const cached = await AsyncStorage.getItem(CACHED_LISTINGS_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
      return [];
    } catch (error) {
      console.error('Error getting cached listings:', error);
      return [];
    }
  }, []);

  const clearCache = useCallback(async () => {
    try {
      // Clear both AsyncStorage cache and FileSystem cache
      await clearAllCache();
      setCachedListingsCount(0);
      setCacheTimestamp(null);
      
      // Refresh cache size
      await loadCacheSize();
      
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }, []);

  const refreshCache = useCallback(async () => {
    // This will be called by the listings hook to update cache
    await loadCacheInfo();
    await loadCacheSize();
  }, []);

  const value: OfflineContextValue = {
    isOnline,
    offlineEnabled,
    networkState,
    cachedListingsCount,
    cacheTimestamp,
    cacheSize,
    cacheSizeBytes,
    enableOfflineMode,
    disableOfflineMode,
    cacheListings,
    getCachedListings,
    clearCache,
    refreshCache,
    refreshCacheSize,
  };

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
