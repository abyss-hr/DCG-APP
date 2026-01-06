// File: src/database/categoryService.ts
// Service for fetching category data from Firebase

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      key: data.key ?? "",
      name: data.name ?? "",
      filterLabel: data.filterLabel ?? "",
      filters: Array.isArray(data.filters) ? data.filters : [],
      extraFilterLabel: data.extraFilterLabel ?? "",
      extras: Array.isArray(data.extras) ? data.extras : [],
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    };
  });
}
import { db } from "./firebaseConfig";
import type { Category, Filter } from "./Category";

/**
 * Fetch category by ID
 */
export async function fetchCategoryById(categoryId: string): Promise<Category | null> {
  try {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      key: data.key ?? "",
      name: data.name ?? "",
      filterLabel: data.filterLabel ?? "",
      filters: Array.isArray(data.filters) ? data.filters : [],
      extraFilterLabel: data.extraFilterLabel ?? "",
      extras: Array.isArray(data.extras) ? data.extras : [],
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

/**
 * Get filter icon by label from category filters
 */
export function getFilterIcon(category: Category, filterLabel: string): string | null {
  const filter = category.filters.find((f) => f.label === filterLabel);
  return filter?.icon || null;
}

/**
 * Get extra filter icon by label from category extras
 */
export function getExtraFilterIcon(category: Category, extraLabel: string): string | null {
  const extra = category.extras.find((e) => e.label === extraLabel);
  return extra?.icon || null;
}
