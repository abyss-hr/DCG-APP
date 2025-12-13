import { useCallback, useEffect, useState } from "react";
import { listingToResultCard, type ResultCardItem } from "./listingAdapter";
import { fetchListings } from "./listingService";

export function useListings() {
  const [data, setData] = useState<ResultCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const rows = await fetchListings();             // 1) RAW FIREBASE DATA
      const mapped = rows.map(listingToResultCard);   // 2) ADAPTER → UI CARD MODEL

      setData(mapped);                                // 3) SAVE IN STATE
    } catch (err) {
      console.error("useListings error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    isLoading: loading,
    refetch: load,
  };
}
