// Simple placeholder – expand later if needed
import type { ResultCardItem } from "@/database/listingAdapter";
import { useMemo } from "react";

export function useFilterOptions(items: ResultCardItem[]) {
  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const it of items) if (it.category) s.add(String(it.category));
    return Array.from(s);
  }, [items]);

  const places = useMemo(() => {
    const s = new Set<string>();
    for (const it of items) {
      const label =
        (it.location as string) ||
        (it.place as string) ||
        "";
      if (label) s.add(label);
    }
    return Array.from(s);
  }, [items]);

  return { categories, places };
}
