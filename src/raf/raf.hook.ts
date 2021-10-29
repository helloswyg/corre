import { MutableRefObject, useEffect, useRef } from 'react';

export type UseRequestAnimationFrameParams = Parameters<typeof useRequestAnimationFrame>;
export type UseRequestAnimationFrameReturn = ReturnType<typeof useRequestAnimationFrame>;

/**
 * Use requestAnimationFrame with Hooks in a declarative way.
 */
export function useRequestAnimationFrame(
  callback: () => void,
  isRunning: boolean = true,
): MutableRefObject<number | null> {
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

  useEffect(() => {
    if (!isRunning) return;

    function tick() {      
      rafRef.current = window.requestAnimationFrame(() => {
        callbackRef.current();

        tick();
      });
    }

    tick();

    // Clear RAF if the components is unmounted or the delay changes:
    return () => {
      window.cancelAnimationFrame(rafRef.current || 0);

      rafRef.current = null;
    };
  }, [isRunning]);

  // In case you want to manually clear the RAF from the consuming component...:
  return rafRef;
}
