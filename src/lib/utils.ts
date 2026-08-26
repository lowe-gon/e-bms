import type { UserRole } from '@/typings';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkRole(role: UserRole): boolean {
  const validRoles: UserRole[] = ['captain', 'secretary', 'treasurer', 'councilor'];
  return validRoles.includes(role);
}

// Utility case conversion helpers
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/**
 * Get currency symbols
 * @param {string} currency - The ISO currency code (default: 'USD')
 * @param {string} locale - The BCP 47 language tag (default: 'en-US')
 * @returns
 */
export function getCurrencySymbol(currency: string = 'PHP', locale: string = 'en-US'): string {
  if (!currency) return '';

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    });

    if (typeof formatter.formatToParts === 'function') {
      const parts = formatter.formatToParts(0);
      const currencyPart = parts.find((p) => p.type === 'currency');
      return currencyPart ? currencyPart.value : currency;
    }

    const formatted = formatter.format(0);
    return formatted.replace(/[\d.,\s]+/g, '').trim();
  } catch (e) {
    console.error(e);
    return currency;
  }
}

export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Data URL string.'));
      }
    };

    reader.onerror = (error) => reject(error);

    // Reads the File/Blob and encodes it as a base64 Data URL
    reader.readAsDataURL(file);
  });
}
