
import { useInterval, UseIntervalParams, UseIntervalReturn } from "./interval.hook";
import { renderHook } from '@testing-library/react-hooks'


// TODO: Create custom matcher as a lib?

function countSetIntervalCalls() {
    // See https://stackoverflow.com/questions/55788137/jest-settimeout-is-being-called-too-many-times
    
    return (window.setInterval as any).mock.calls.filter(([fn, t]: [Function, number]) => (
      t !== 0 ||
      !String(fn).includes('_flushCallback')
    ));
}

function expectIntervalCall(times: number, args?: [Function, number]) {
    const calls = countSetIntervalCalls();

    expect(calls).toHaveLength(times);

    if (times === 0 || !args) return;

    expect(calls[calls.length - 1]).toMatchObject(args);
}

describe('useInterval()', () => {
    
    beforeEach(() => {
        jest.useFakeTimers('legacy');
        jest.spyOn(window, 'setInterval');
        jest.spyOn(window, 'clearInterval');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('sets and clears the interval', () => {
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
   
    it('doesn\'t do anything if timeout is NaN or not a number', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseIntervalParams, UseIntervalReturn>((args) => {
            return useInterval(...args);
        }, {
            initialProps: [
                callback,
                NaN,
            ],
        });
        
        expect(result.current.current).toBeNull();
        expect(callback).not.toHaveBeenCalled();    
        expectIntervalCall(0);
        
        jest.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();    
        expectIntervalCall(0);

        rerender([callback, '10' as any]);       

        expect(callback).not.toHaveBeenCalled();    
        expectIntervalCall(0);

        jest.advanceTimersByTime(1000);

        expect(callback).not.toHaveBeenCalled();    
        expectIntervalCall(0);
    });
    
});
