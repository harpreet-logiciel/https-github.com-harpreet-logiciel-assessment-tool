import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEYS = {
  ASSESSMENT: 'mvp-assessment',
  USER_ID: 'assessment-user-id',
  SYNC_QUEUE: 'assessment-sync-queue',
  AUTH_TOKEN: 'sb-iueaipldagalhwuvncoh-auth-token',
  SUPABASE_TOKEN: 'supabase.auth.token',
  SUPABASE_REFRESH: 'supabase.auth.refreshToken'
} as const;

export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  });
}

export function saveToLocalStorage(key: string, data: any) {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

export function removeFromLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

export const storage = {
  KEYS: STORAGE_KEYS,
  clear: clearAllStorage,
  save: saveToLocalStorage,
  get: getFromLocalStorage,
  remove: removeFromLocalStorage
};
