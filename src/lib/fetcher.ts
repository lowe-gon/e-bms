import { tryCatch, type Result } from '@/lib/try-catch';

/**
 * A utility function that wraps the `fetch` API call in a try-catch block
 * and returns a `Result` type, encapsulating either the successful response
 * or an error.
 *
 * @template T - The expected type of the successful response data.
 * @template E - The type of the error to be returned (defaults to `Error`).
 *
 * @param input - The resource that you wish to fetch. This can be a URL string
 * or a `Request` object.
 * @param init - An optional object containing custom settings for the request.
 *
 * @returns A `Promise` that resolves to a `Result` type, which contains either
 * the parsed response data of type `T` or an error of type `E`.
 *
 * @throws Will throw an error if the response is not OK (status code outside the range 200-299).
 * The error message will be derived from the response JSON (if available) or the HTTP status text.
 */
export async function fetcher<T, E = Error>(
  url: RequestInfo | URL,
  options?: RequestInit,
): Promise<Result<T, E>> {
  return tryCatch<T, E>(
    (async () => {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return response.json() as T;
    })(),
  );
}
