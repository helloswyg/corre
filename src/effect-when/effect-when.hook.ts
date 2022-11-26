import React, { useCallback, useEffect, useRef } from "react";

export function useEffectWhen(
  callback: (done?: () => void) => void | boolean | Promise<void | boolean>,
  deps: React.DependencyList
) {
  const callbackCalledRef = useRef(false);

  const done = useCallback(() => {
    callbackCalledRef.current = true;
  }, []);

  // TODO: Use a ref for the callback so that we don't cause a re-render by returning `invoke`:
  const invoke = useCallback(() => {
    const isDone = callback(done);

    if (isDone === true || (isPromise(isDone) && await isDone === true)) callbackCalledRef.current = true;
  }, [done,]);

  const reset = useCallback(() => {
    callbackCalledRef.current = false;
  }, []);

  useEffect(() => {
    if (callbackCalledRef.current) return;

    invoke()
  }, [invoke, ...deps]);

  return { invoke, reset }
}
