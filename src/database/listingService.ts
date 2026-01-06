import {
  collection,
  getDocs,
  getDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebaseConfig";
import type { Listing } from "./Listing";

/* ----------------------------------
 * Helpers
 * ---------------------------------- */

function mapListing(id: string, data: any): Listing {
  return {
    id,
    title: data.title ?? "",
    description: data.description ?? "",
    descriptionFeatured: data.descriptionFeatured ?? "",
    categoryId: data.categoryId ?? "",
    categoryName: data.categoryName ?? "",
    categoryIcon: data.categoryIcon ?? "",
    filterMain: data.filterMain ?? "",
    filterMainIcon: data.filterMainIcon ?? "",
    filterExtra: data.filterExtra ?? "",
    filterExtraIcon: data.filterExtraIcon ?? "",
    locationMain: data.locationMain ?? "",
    locationSub: data.locationSub ?? "",
    googleMapUrl: data.googleMapUrl ?? "",
    coordinates: data.coordinates ?? "",
    youtubeUrl: data.youtubeUrl ?? "",
    phone: data.phone ?? "",
    whatsapp: data.whatsapp ?? "",
    email: data.email ?? "",
    website: data.website ?? "",
    facebook: data.facebook ?? "",
    instagram: data.instagram ?? "",
    priceLevel: data.priceLevel ?? "",
    workingPeriod: data.workingPeriod ?? "",
    featuredImageUrl: data.featuredImageUrl ?? "",
    galleryImageUrls: Array.isArray(data.galleryImageUrls)
      ? data.galleryImageUrls
      : [],
    featured: !!data.featured,
    popular: !!data.popular,
    status: data.status ?? "draft",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

/* ----------------------------------
 * Fetch all published listings
 * ---------------------------------- */

export async function fetchListings(): Promise<Listing[]> {
  const q = query(
    collection(db, "listings"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => mapListing(d.id, d.data()));
}

/* ----------------------------------
 * Fetch single listing by ID
 * ---------------------------------- */

export async function fetchListingById(
  id: string
): Promise<Listing | null> {
  const ref = doc(db, "listings", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return mapListing(snap.id, snap.data());
}

/* ----------------------------------
 * Fetch listings by category (excluding current)
 * ---------------------------------- */

export async function fetchListingsByCategory(
  categoryId: string,
  excludeId?: string,
  limit: number = 10
): Promise<Listing[]> {
  const q = query(
    collection(db, "listings"),
    where("status", "==", "published"),
    where("categoryId", "==", categoryId)
  );

  const snap = await getDocs(q);

  return snap.docs
    .map((d) => mapListing(d.id, d.data()))
    .filter((listing) => listing.id !== excludeId)
    .sort((a, b) => {
      // Sort by createdAt in memory
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}
