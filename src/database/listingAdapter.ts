import type { Listing } from "./Listing";

export type ResultCardItem = {
  id: string;

  title: string;
  description: string;

  category?: string | null;
  location?: string | null;
  place?: string | null;

  imageUrl?: string | null;
  imageUrls?: string[] | null;

  isPromo?: boolean;
  isPopular?: boolean;

  videoUrls?: string[] | null;

  coordinates?: { lat: number; lng: number } | null;
};

export function listingToResultCard(list: Listing): ResultCardItem {
  const images: string[] = [];

  if (list.featuredImageUrl) images.push(list.featuredImageUrl);
  if (Array.isArray(list.galleryImageUrls)) {
    list.galleryImageUrls.forEach((url) => {
      if (url && !images.includes(url)) images.push(url);
    });
  }

  let coords: { lat: number; lng: number } | null = null;
  if (list.coordinates) {
    const [latStr, lngStr] = list.coordinates.split(",");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) coords = { lat, lng };
  }

  return {
    id: list.id,
    title: list.title,
    description: list.description,

    category: list.categoryName || null,
    location: list.locationMain || null,
    place: list.locationSub || list.locationMain || null,

    imageUrl: images[0] ?? null,
    imageUrls: images.length ? images : null,

    isPromo: list.featured,
    isPopular: list.popular,

    videoUrls: list.youtubeUrl ? [list.youtubeUrl] : null,

    coordinates: coords,
  };
}
