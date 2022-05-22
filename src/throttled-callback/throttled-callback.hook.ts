import { useCallback, useEffect, useRef, DependencyList } from 'react';

export type UseThrottledCallbackParams = Parameters<typeof useThrottledCallback>;
export type UseThrottledCallbackReturn = ReturnType<typeof useThrottledCallback>;

/**
 * An optional options object for `useThrottledCallback`.
 */
export interface UseThrottledCallbackOptions {
  /**
   * If `true`, `callback` will never be called immediately, it will always be called from a
   * setTimeout, which causes an additional render but makes the app feel way more responsive.
   */
  makeResponsive?: boolean;
}

/**
 * Returns a throttled version of `callback` with the specified delay.
 */
export function useThrottledCallback<A extends any[]>(
  callback: (...args: A) => void,
  delay: number,
  deps: DependencyList = [],
  options: UseThrottledCallbackOptions = {},
): (...args: A) => void {
  const timeoutRef = useRef<number>();
  const callbackRef = useRef(callback);
  const lastCalledRef = useRef(0);
  const { makeResponsive } = options;

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear timeout if the components is unmounted or the delay changes:
  useEffect(() => {
    window.clearTimeout(timeoutRef.current);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);

  return useCallback((...args: A) => {
    // Clear previous timer:
    window.clearTimeout(timeoutRef.current);

    function invoke() {
      callbackRef.current(...args);
      lastCalledRef.current = Date.now();
    }

    // Calculate elapsed time:
    const elapsed = Date.now() - lastCalledRef.current;

    if (elapsed >= delay && !makeResponsive) {
      // If already waited enough, call callback:
      invoke();
    } else {
      // Otherwise, we need to wait a bit more:
      timeoutRef.current = window.setTimeout(invoke, Math.max(delay - elapsed, 0));
    }

  // The spread element means passed dependencies can't be statically verified (that's fine):
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, makeResponsive]);
}
