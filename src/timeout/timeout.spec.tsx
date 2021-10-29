
import { useTimeout, UseTimeoutParams, UseTimeoutReturn } from "./timeout.hook";
import { renderHook } from '@testing-library/react-hooks'


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

describe('useTimeout()', () => {
    
    beforeEach(() => {
        jest.useFakeTimers('legacy');
        jest.spyOn(window, 'setTimeout');
        jest.spyOn(window, 'clearTimeout');
    });

    afterEach(() => {
        jest.useRealTimers();
    });
    
    it('sets and clears the timeout', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseTimeoutParams, UseTimeoutReturn>((args) => {
            return useTimeout(...args);
        }, {
            initialProps: [
                callback,
                1000,
            ],
        });
        
        expect(result.current.current).toBeTruthy();
        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(1, [expect.any(Function), 1000]);
        
        jest.runAllTimers(); 

        expect(callback).toHaveBeenCalledOnce();        
        expectTimeoutCall(1, [expect.any(Function), 1000]);

        rerender([callback, 1000]);       
        jest.runAllTimers();  

        expect(callback).toHaveBeenCalledOnce();
        expectTimeoutCall(1, [expect.any(Function), 1000]);

        rerender([callback, 500]);
        jest.runAllTimers();        

        expect(callback).toHaveBeenCalledTimes(2);
        expectTimeoutCall(2, [expect.any(Function), 500]);
        expect(clearTimeout).toHaveBeenCalledOnce();
    });
   
    it('doesn\'t do anything if timeout is NaN or not a number', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseTimeoutParams, UseTimeoutReturn>((args) => {
            return useTimeout(...args);
        }, {
            initialProps: [
                callback,
                NaN,
            ],
        });
        
        expect(result.current.current).toBeNull();
        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(0);
        
        jest.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(0);

        rerender([callback, '10' as any]);       

        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(0);

        jest.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();    
        expectTimeoutCall(0);
    });
    
});
