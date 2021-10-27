
import { renderHook } from '@testing-library/react-hooks'
import { useThrottledCallback, UseThrottledCallbackParams, UseThrottledCallbackReturn } from "./throttled-callback.hook";

jest.useFakeTimers();
jest.spyOn(window, 'setTimeout');
jest.spyOn(window, 'clearTimeout');

// TODO: Create custom matcher as a lib?

function countSetTimeoutCalls() {
    // See https://stackoverflow.com/questions/55788137/jest-settimeout-is-being-called-too-many-times
    
    return (window.setTimeout as any).mock.calls.filter(([fn, t]: [Function, number]) => (
      t !== 0 ||
      !String(fn).includes('_flushCallback')
    ));
}

function expectTimeoutCall(times: number, args?: [Function, number]) {
    const calls = countSetTimeoutCalls();

    expect(calls).toHaveLength(times);

    if (times === 0 || !args) return;

    expect(calls[calls.length - 1]).toMatchObject(args);
}

describe('useThrottledCallback()', () => {
    
    it('runs', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseThrottledCallbackParams, UseThrottledCallbackReturn>((args) => {
            return useThrottledCallback(...args);
        }, {
            initialProps: [
                callback,
                1000,
            ],
        });
        
        expect(result.current).toBeFunction();
        // expect(result.current).not.toHaveBeenCalled();    
        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(0);
        
        jest.advanceTimersByTime(1000);
        
        expect(result.current).toBeFunction();
        // expect(result.current).not.toHaveBeenCalled();  
        expect(callback).not.toHaveBeenCalled();      
        expectTimeoutCall(0);

        result.current();
        
        // expect(result.current).toHaveBeenCalledTimes(1);  
        expect(callback).toHaveBeenCalled();    
        expectTimeoutCall(0);
        // expect(clearInterval).toHaveBeenCalledTimes(1);
      
        jest.advanceTimersByTime(1000);
        
        // expect(result.current).toHaveBeenCalledTimes(1);  
        expect(callback).toHaveBeenCalledTimes(1);   
        expectTimeoutCall(0);
      
        jest.advanceTimersByTime(1000);
        
        // expect(result.current).toHaveBeenCalledTimes(1);  
        expect(callback).toHaveBeenCalledTimes(1);  
        expectTimeoutCall(0);
        
        result.current();
        result.current();
        result.current();

        // expect(result.current).toHaveBeenCalledTimes(4);  
        expect(callback).toHaveBeenCalledTimes(2);  
        expectTimeoutCall(2);
        // expect(clearInterval).toHaveBeenCalledTimes(2);
        
        jest.advanceTimersByTime(1000);

        // expect(result.current).toHaveBeenCalledTimes(4);  
        expect(callback).toHaveBeenCalledTimes(3);  
        expectTimeoutCall(2);
        // expect(clearInterval).toHaveBeenCalledTimes(2);
    });

    // TODO: Add test with makeResponsive = true
    
});
