
import { useTimeout, UseTimeoutParams, UseTimeoutReturn } from "./timeout.hook";
import { renderHook } from '@testing-library/react-hooks'

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

function expectTimeoutCall(times: number, args: [Function, number]) {
    const calls = countSetTimeoutCalls();

    expect(calls).toHaveLength(times);
    expect(calls[calls.length - 1]).toMatchObject(args);
}

describe('useTimeout()', () => {
    
    it('runs', () => {
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
    
});
