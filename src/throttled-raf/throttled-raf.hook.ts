import { MutableRefObject, useEffect, useRef } from 'react';


export type UseThrottledRequestAnimationFrameParams = Parameters<typeof useThrottledRequestAnimationFrame>;
export type UseThrottledRequestAnimationFrameReturn = ReturnType<typeof useThrottledRequestAnimationFrame>;

/**
 * Declarative hook to call `requestAnimationFrame` every `delay` milliseconds with `callback`.
 *
 * @see Browser API: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
export function useThrottledRequestAnimationFrame(
  callback: () => void,
  delay: number | null,
  isRunning: boolean = true,
): [MutableRefObject<number | null>, MutableRefObject<number | null>] {
  const intervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  useEffect(() => {
    if (!isRunning) return;

    if (typeof delay === 'number' && !isNaN(delay)) {
      intervalRef.current = window.setInterval(() => {
        rafRef.current = window.requestAnimationFrame(() => {
          callbackRef.current();
        });
      }, delay);

      // Clear interval and RAF if the components is unmounted or the delay changes:
      return () => {
        window.clearInterval(intervalRef.current || 0);
        window.cancelAnimationFrame(rafRef.current || 0);
        
        intervalRef.current = null;
        rafRef.current = null;
      };
    }
  }, [delay, isRunning]);

  // In case you want to manually clear the interval or RAF from the consuming component...:
  return [intervalRef, rafRef]
}
