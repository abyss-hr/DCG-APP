// src/theme/ThemeProvider.tsx
'use client';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

import { ColorTheme, darkTheme, lightTheme } from '@/theme/colors';
import { typography } from '@/theme/typography';
// (Optional future imports)
// import { spacing } from '@/theme/spacing';
// import { radii } from '@/theme/radii';
// import { shadows } from '@/theme/shadows';
// import { components } from '@/theme/components';

type ThemeMode = 'system' | 'light' | 'dark';

export type AppTheme = {
  colors: ColorTheme;
  typography: typeof typography;
  // spacing: typeof spacing;        // optional
  // radii: typeof radii;            // optional
  // shadows: typeof shadows;        // optional
  // components: ReturnType<typeof components>;
};

type ThemeContextValue = {
  theme: ColorTheme; // old API (KEEP for compatibility)
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark'; // NEW: the actual resolved mode
  setMode: (m: ThemeMode) => void;
  toggle: () => void;

  // NEW API (non-breaking):
  appTheme: AppTheme;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'app.theme.mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark' | null>(() => {
    const initial = Appearance.getColorScheme() || 'light';
    console.log('[ThemeProvider] Initial system theme:', initial);
    return initial;
  });

  // Load saved theme mode
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('[ThemeProvider] Loaded saved mode:', saved);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setModeState(saved);
        }
      } catch {}
    })();
  }, []);

  // Listen to system theme changes - this is the key fix!
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('[ThemeProvider] System theme changed to:', colorScheme);
      setSystemScheme(colorScheme || 'light');
    });

    return () => subscription.remove();
  }, []);

  // Save theme mode
  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch {}
  };

  // Resolve system/light/dark - this now properly reacts to systemScheme changes
  const effectiveMode = useMemo<'light' | 'dark'>(() => {
    if (mode === 'system') {
      const resolved = systemScheme === 'dark' ? 'dark' : 'light';
      console.log('[ThemeProvider] Mode is system, resolved to:', resolved, '(systemScheme:', systemScheme, ')');
      return resolved;
    }
    console.log('[ThemeProvider] Using explicit mode:', mode);
    return mode;
  }, [mode, systemScheme]);

  const resolvedColors = useMemo(() => {
    const baseTheme = effectiveMode === 'dark' ? darkTheme : lightTheme;
    // Ensure the theme object always has the correct effective mode
    return { ...baseTheme, mode: effectiveMode };
  }, [effectiveMode]);

  // Toggle handler (same API as before)
  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark');

  // Build unified theme object (NEW)
  const appTheme: AppTheme = useMemo(
    () => ({
      colors: resolvedColors,
      typography,
      // spacing,
      // radii,
      // shadows,
      // components: components(resolvedColors),
    }),
    [resolvedColors]
  );

  // Old: { theme } remains for compatibility
  const value: ThemeContextValue = {
    theme: resolvedColors,
    mode,
    effectiveMode,
    setMode,
    toggle,
    appTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
