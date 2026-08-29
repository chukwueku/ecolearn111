import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts initials from display name (e.g. "Chukwueku David" -> "CD", "John" -> "JO").
 * First letter of first name + First letter of surname.
 */
export const getUserInitials = (displayName?: string | null, email?: string | null): string => {
  const name = (displayName || '').trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
      return parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
  }

  if (email) {
    const username = email.split('@')[0].trim();
    const parts = username.split(/[\._\-]/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (username.length >= 2) {
      return username.substring(0, 2).toUpperCase();
    } else if (username.length === 1) {
      return username[0].toUpperCase();
    }
  }

  return 'S';
};
