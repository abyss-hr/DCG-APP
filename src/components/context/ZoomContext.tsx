// src/components/context/ZoomContext.tsx
// Context for managing card zoom/display mode across the app

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export type ZoomMode = 'grid' | 'list';

const ZOOM_STORAGE_KEY = '@dcg_explore_zoom';

type ZoomContextType = {
  zoomMode: ZoomMode;
  setZoomMode: (mode: ZoomMode) => Promise<void>;
  toggleZoom: () => Promise<void>;
};

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

type ZoomProviderProps = {
  children: ReactNode;
};

export function ZoomProvider({ children }: ZoomProviderProps) {
  const [zoomMode, setZoomModeState] = useState<ZoomMode>('list');

  // Load saved zoom preference on mount
  useEffect(() => {
    loadZoomMode();
  }, []);

  const loadZoomMode = async () => {
    try {
      const savedZoom = await AsyncStorage.getItem(ZOOM_STORAGE_KEY);
      if (savedZoom === 'grid' || savedZoom === 'list') {
        setZoomModeState(savedZoom);
      }
    } catch (error) {
      console.error('Failed to load zoom mode:', error);
    }
  };

  const setZoomMode = async (mode: ZoomMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setZoomModeState(mode);
      await AsyncStorage.setItem(ZOOM_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save zoom mode:', error);
    }
  };

  const toggleZoom = async () => {
    const newMode: ZoomMode = zoomMode === 'grid' ? 'list' : 'grid';
    await setZoomMode(newMode);
  };

  return (
    <ZoomContext.Provider value={{ zoomMode, setZoomMode, toggleZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom(): ZoomContextType {
  const context = useContext(ZoomContext);
  if (context === undefined) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
}
