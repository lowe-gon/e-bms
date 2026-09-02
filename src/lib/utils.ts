import type { ResponseMetadata } from '@/typings/api.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Base64 string or Data URL into a Blob.
 *
 * Use this when:
 * - You need to upload the Base64 data using FormData.
 * - You need a Blob for APIs such as fetch(), URL.createObjectURL(), etc.
 * - You don't specifically need a File object.
 *
 * Supports:
 * - Plain Base64: "iVBORw0KGgo..."
 * - Data URL: "data:image/png;base64,iVBORw0KGgo..."
 */
export function base64ToBlob(base64: string, mimeType = 'application/octet-stream'): Blob {
  // Remove the Data URL prefix if it exists.
  // Example: "data:image/png;base64,"
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  const binaryString = atob(base64Data || '');

  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}

/**
 * Converts a Base64 Data URL into a File.
 *
 * The filename is expected to be included in the Data URL:
 * data:image/png;name=photo.png;base64,...
 *
 * Use this when:
 * - You want to convert Base64 back to a File.
 * - You want the filename to travel together with the Base64.
 */
export function base64ToFile(base64: string): File {
  const [metadata, data] = base64.split(',');

  if (!metadata || !data) {
    throw new Error('Invalid Base64 Data URL');
  }

  const mimeType =
    metadata.match(/^data:(.*?)(?:;name=.*?)?;base64$/)?.[1] || 'application/octet-stream';

  const fileName = metadata.match(/;name=([^;]+)/)?.[1] || 'file';

  const binaryString = atob(data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], fileName, {
    type: mimeType,
  });
}

/**
 * Converts a File into a Base64 Data URL.
 *
 * Use this when:
 * - You need to send a file as Base64.
 * - You need to store the file content as a string.
 * - You need a Base64 string for an API or JSON payload.
 *
 * Example result:
 * "data:image/png;base64,iVBORw0KGgo..."
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Creates pagination metadata for an API response.
 *
 * Use this helper when returning paginated data from an API endpoint.
 *
 * Example:
 *
 * const metadata = getApiMetadata({
 *   page: 1,
 *   limit: 10,
 *   pageSize: users.length,
 *   totalItems: 125,
 * });
 *
 * // Returns:
 * // {
 * //   page: 1,
 * //   limit: 10,
 * //   pageSize: 10,
 * //   totalItems: 125,
 * //   totalPages: 13
 * // }
 *
 * @param page - The current page number (1-based).
 * @param limit - The maximum number of items requested per page.
 * @param pageSize - The actual number of items returned on the current page.
 * @param totalItems - The total number of items matching the query.
 */
export function getApiMetadata({
  page,
  limit,
  pageSize,
  totalItems,
}: {
  page: number;
  limit: number;
  pageSize: number;
  totalItems: number;
}): ResponseMetadata {
  return {
    page,
    limit,
    pageSize,
    totalPages: Math.ceil(totalItems / limit),
  };
}
