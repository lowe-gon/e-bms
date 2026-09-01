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
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  return promise
    .then((data) => {
      return [data, null] as const;
    })
    .catch((error) => {
      return [null, error as E] as const;
    });
}
