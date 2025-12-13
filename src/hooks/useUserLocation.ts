// src/hooks/useUserLocation.ts
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type UserLocation = { lat: number; lng: number } | null;

export function useUserLocation(autoAsk = false) {
  const [location, setLocation] = useState<UserLocation>(null);
  const [granted, setGranted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const ok = status === 'granted';
      setGranted(ok);
      if (!ok) return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: any) {
      setError(e?.message ?? 'Location error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoAsk) ask();
  }, [autoAsk, ask]);

  return { location, granted, loading, error, ask };
}