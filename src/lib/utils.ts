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

/**
 * Converts a given string to camelCase format.
 *
 * This utility function takes a string as input and transforms it into camelCase
 * by replacing underscores followed by a lowercase letter with the uppercase version
 * of that letter. It is useful for converting snake_case strings to camelCase.
 *
 * @param str - The input string to be converted to camelCase.
 * @returns The camelCase formatted string.
 *
 * @example
 * ```typescript
 * const result = toCamelCase("example_string");
 * console.log(result); // "exampleString"
 * ```
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
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
