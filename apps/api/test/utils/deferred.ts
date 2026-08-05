/**
 * Creates a deferred promise with manual resolve/reject methods.
 * Automatically rejects if not settled within the given timeout
 */
export default function deferred<T>(timeoutMs = 10_000) {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    // Auto reject after timeout
    // It keeps the Node event loop referenced
    const timer = setTimeout(() => {
      rej(
        new Error(
          `Deferred promise timed out after ${timeoutMs.toString()} ms`,
        ),
      );
    }, timeoutMs);

    // Clear timeout if resolved/rejected early
    const wrapResolve = (value: T | PromiseLike<T>) => {
      clearTimeout(timer);
      res(value);
    };
    const wrapReject = (reason: Error) => {
      clearTimeout(timer);
      rej(reason);
    };

    resolve = wrapResolve;
    reject = wrapReject;
  });

  return { promise, resolve, reject };
}
