import { MutableRefObject, useEffect, useRef } from 'react';

export type UseIntervalParams = Parameters<typeof useInterval>;
export type UseIntervalReturn = ReturnType<typeof useInterval>;

/**
 * Use setInterval with Hooks in a declarative way.
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  deps: React.DependencyList = [],
): MutableRefObject<number | null> {
  const intervalRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset. TODO: This could be an option.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  useEffect(() => {
    if (typeof delay === 'number' && !isNaN(delay)) {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

      // Clear interval if the components is unmounted or the delay changes:
      return () => {
        window.clearInterval(intervalRef.current || 0);

        intervalRef.current = null;
      };
    }

    // The spread element means passed dependencies can't be statically verified (that's fine):
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay, ...deps]);

  // In case you want to manually clear the interval from the consuming component...:
  return intervalRef;
}
