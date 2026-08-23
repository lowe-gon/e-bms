type SuccessResult<T> = readonly [T, null];
type ErrorResult<E = Error> = readonly [null, E];

type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

/**
 * A utility function that wraps a promise and returns a tuple containing
 * either the resolved value or an error. This helps in handling asynchronous
 * operations without the need for try-catch blocks.
 *
 * @template T - The type of the resolved value of the promise.
 * @template E - The type of the error, defaults to `Error`.
 * @param promise - The promise to be wrapped.
 * @returns A promise that resolves to a tuple:
 *          - The first element is the resolved value of the promise, or `null` if an error occurred.
 *          - The second element is the error, or `null` if the promise resolved successfully.
 */
export async function withCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  return promise
    .then((data) => {
      return [data, null] as const;
    })
    .catch((error) => {
      return [null, error as E] as const;
    });
}

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
export async function catchFetch<T, E = Error>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Result<T, E>> {
  return withCatch<T, E>(
    (async () => {
      const response = await fetch(input, init);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return response.json();
    })(),
  );
}
