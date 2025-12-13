// components/context/FavoritesContext.tsx
import * as Haptics from 'expo-haptics';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@dcg_favorites';

/** Minimal favorite item shape used across the app (now includes `place`, maps, videos). */
export type FavoriteItem = {
  id: string;
  title?: string;
  description?: string;

  // images
  imageUrl?: string;      // cover (single)
  imageUrls?: string[];   // gallery (array)

  // meta
  location?: string;
  category?: string;      // 'Restaurant' | 'Beach' | 'Experience' | ...
  place?: string;         // ← added

  // flags
  isPromo?: boolean;
  isPopular?: boolean;

  // maps / video (optional)
  latLng?: string;        // "lat,lng"
  mapLink?: string;       // external URL
  videoUrls?: string[];   // youtube/full URLs
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveFavorites(favorites);
    }
  }, [favorites, isLoaded]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveFavorites = async (items: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);

      // Normalize a cover if only imageUrls array is provided
      const cover = item.imageUrl ?? (Array.isArray(item.imageUrls) ? item.imageUrls[0] : undefined);
      const normalized: FavoriteItem = cover ? { ...item, imageUrl: cover } : { ...item };

      if (!exists) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return [normalized, ...prev];
      } else {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return prev.filter((f) => f.id !== item.id);
      }
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    void Haptics.selectionAsync();
  };

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within <FavoritesProvider>');
  return ctx;
}