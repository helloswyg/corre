
import { useInterval, UseIntervalParams, UseIntervalReturn } from "./interval.hook";
import { renderHook } from '@testing-library/react-hooks'

jest.useFakeTimers();
jest.spyOn(window, 'setInterval');
jest.spyOn(window, 'clearInterval');

// TODO: Create custom matcher as a lib?

function countSetIntervalCalls() {
    // See https://stackoverflow.com/questions/55788137/jest-settimeout-is-being-called-too-many-times
    
    return (window.setInterval as any).mock.calls.filter(([fn, t]: [Function, number]) => (
      t !== 0 ||
      !String(fn).includes('_flushCallback')
    ));
}

function expectIntervalCall(times: number, args: [Function, number]) {
    const calls = countSetIntervalCalls();

    expect(calls).toHaveLength(times);
    expect(calls[calls.length - 1]).toMatchObject(args);
}

describe('useInterval()', () => {
    
    it('runs', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseIntervalParams, UseIntervalReturn>((args) => {
            return useInterval(...args);
        }, {
            initialProps: [
                callback,
                1000,
            ],
        });
        
        expect(result.current.current).toBeTruthy();
        expect(callback).not.toHaveBeenCalled();    
        expectIntervalCall(1, [expect.any(Function), 1000]);
        
        jest.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(1);        
        expectIntervalCall(1, [expect.any(Function), 1000]);

        rerender([callback, 1000]);       
        jest.advanceTimersByTime(1000);

        expect(callback).toHaveBeenCalledTimes(2);
        expectIntervalCall(1, [expect.any(Function), 1000]);

        rerender([callback, 500]);
        jest.advanceTimersByTime(2000);

        expect(callback).toHaveBeenCalledTimes(6);
        expectIntervalCall(2, [expect.any(Function), 500]);
        expect(clearInterval).toHaveBeenCalledOnce();
    });
    
});
