// src/hooks/useRefreshWithHint.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

type Options = {
  delayMs?: number;          // minimum spinner time (feel better)
  slowHintAfterMs?: number;  // show "slow network" hint after this
  onRefresh?: () => Promise<void> | void;
};

export function useRefreshWithHint(options: Options = {}) {
  const { delayMs = 800, slowHintAfterMs = 2500, onRefresh } = options;

  const [refreshing, setRefreshing] = useState(false);
  const [slow, setSlow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (refreshing) {
      timerRef.current = setTimeout(() => setSlow(true), slowHintAfterMs);
    } else {
      setSlow(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [refreshing, slowHintAfterMs]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    void Haptics.selectionAsync();
    try {
      const minWait = new Promise((r) => setTimeout(r, delayMs));
      if (onRefresh) {
        await Promise.all([minWait, onRefresh()]);
      } else {
        await minWait;
      }
    } finally {
      setRefreshing(false);
    }
  }, [delayMs, onRefresh]);

  return { refreshing, slow, refresh };
}