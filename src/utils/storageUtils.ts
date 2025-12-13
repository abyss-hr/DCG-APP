// storageUtils.ts
// Utilities for calculating storage usage

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Directory } from 'expo-file-system';

/**
 * Calculate the size of all AsyncStorage data in bytes
 */
export async function getAsyncStorageSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        // Calculate size: key length + value length in bytes
        // UTF-8 encoding: ~1 byte per ASCII char, up to 4 bytes for other chars
        const size = new Blob([key + value]).size;
        totalSize += size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating AsyncStorage size:', error);
    return 0;
  }
}

/**
 * Calculate the size of cached files in FileSystem
 */
export async function getFileSystemCacheSize(): Promise<number> {
  try {
    const cacheDirPath = FileSystem.Paths.cache?.uri;
    if (!cacheDirPath) return 0;

    const cacheDir = new Directory(cacheDirPath);
    
    // Check if directory exists
    if (!cacheDir.exists) return 0;

    // Get all files in cache directory
    const files = await cacheDir.list();
    let totalSize = 0;

    for (const file of files) {
      try {
        const fileSize = await file.size;
        totalSize += fileSize || 0;
      } catch (error) {
        // Skip files that can't be accessed
        console.warn(`Could not get size for file: ${file.uri}`, error);
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating FileSystem cache size:', error);
    return 0;
  }
}

/**
 * Calculate total cache size (AsyncStorage + FileSystem)
 */
export async function getTotalCacheSize(): Promise<number> {
  const [asyncStorageSize, fileSystemSize] = await Promise.all([
    getAsyncStorageSize(),
    getFileSystemCacheSize(),
  ]);

  return asyncStorageSize + fileSystemSize;
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Clear all AsyncStorage cache (except favorites and settings)
 */
export async function clearAsyncStorageCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    
    // Keys to preserve
    const preserveKeys = [
      '@dcg_favorites',
      'app.theme.mode',
      '@dcg_explore_zoom',
      '@dcg_offline_enabled',
    ];

    // Filter out keys to remove
    const keysToRemove = keys.filter(key => !preserveKeys.includes(key));

    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }

    console.log(`Cleared ${keysToRemove.length} cache items from AsyncStorage`);
  } catch (error) {
    console.error('Error clearing AsyncStorage cache:', error);
    throw error;
  }
}

/**
 * Clear FileSystem cache directory
 */
export async function clearFileSystemCache(): Promise<void> {
  try {
    const cacheDirPath = FileSystem.Paths.cache?.uri;
    if (!cacheDirPath) return;

    const cacheDir = new Directory(cacheDirPath);
    if (!cacheDir.exists) return;

    const files = await cacheDir.list();

    for (const file of files) {
      try {
        await file.delete();
      } catch (error) {
        console.warn(`Could not delete file: ${file.uri}`, error);
      }
    }

    console.log(`Cleared ${files.length} files from FileSystem cache`);
  } catch (error) {
    console.error('Error clearing FileSystem cache:', error);
    throw error;
  }
}

/**
 * Clear all cache (AsyncStorage + FileSystem)
 */
export async function clearAllCache(): Promise<void> {
  await Promise.all([
    clearAsyncStorageCache(),
    clearFileSystemCache(),
  ]);
}
