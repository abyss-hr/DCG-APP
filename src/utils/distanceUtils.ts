// @/utils/distanceUtils.ts

import haversine from 'haversine-distance';
/**
 * Distance calculation utilities using Haversine formula
 */

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Calculate distance between two coordinates in kilometers
 * Using Haversine formula
 */
export function calculateDistance(coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }): number {
  return haversine(coord1, coord2); // returns meters
}

/**
 * Format distance in meters/kilometers
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}



/**
 * Parse coordinates from listing data
 */
export function parseCoordinates(
  listing: any
): Coordinates | null {
  // Try latLng string format first (from ResultCardItem)
  // NOTE: WordPress stores as "latitude,longitude" but check if values are swapped
  if (listing.latLng && typeof listing.latLng === 'string') {
    const parts = listing.latLng.split(',');
    if (parts.length === 2) {
      let lat = parseFloat(parts[0].trim());
      let lng = parseFloat(parts[1].trim());
      
      // Check if coordinates are swapped (latitude should be -90 to 90, longitude -180 to 180)
      // Dubrovnik area: latitude ~42-43, longitude ~18
      // If first value is ~18 and second is ~42, they're swapped
      if (!isNaN(lat) && !isNaN(lng)) {
        // If lat is outside valid range (-90 to 90) or looks like longitude, swap them
        if (Math.abs(lat) > 90 || (Math.abs(lat) < 20 && Math.abs(lng) > 40)) {
          const temp = lat;
          lat = lng;
          lng = temp;
        }
        return { latitude: lat, longitude: lng };
      }
    }
  }

  // Try direct latitude/longitude properties
  if (listing.latitude && listing.longitude) {
    return {
      latitude: parseFloat(listing.latitude),
      longitude: parseFloat(listing.longitude),
    };
  }

  // Try location object
  if (listing.location?.latitude && listing.location?.longitude) {
    return {
      latitude: parseFloat(listing.location.latitude),
      longitude: parseFloat(listing.location.longitude),
    };
  }

  // Try coordinates object
  if (listing.coordinates) {
    return {
      latitude: parseFloat(listing.coordinates.latitude || listing.coordinates.lat),
      longitude: parseFloat(listing.coordinates.longitude || listing.coordinates.lng),
    };
  }

  return null;
}
