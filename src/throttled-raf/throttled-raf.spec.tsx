
import { renderHook } from '@testing-library/react-hooks'
import { useThrottledRequestAnimationFrame, UseThrottledRequestAnimationFrameParams, UseThrottledRequestAnimationFrameReturn } from './throttled-raf.hook';


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

describe('useThrottledRequestAnimationFrame()', () => {
    
    beforeEach(() => {
        jest.useFakeTimers('legacy');
        jest.spyOn(window, 'setInterval');
        jest.spyOn(window, 'clearInterval');
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) =>cb());
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);  
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('runs if isRunning = true', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseThrottledRequestAnimationFrameParams, UseThrottledRequestAnimationFrameReturn>((args) => {
            return useThrottledRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
                1000,
            ],
        });
        
        expect(result.current).toBeTruthy();
        expect(result.current).toBeArrayOfSize(2);
        expect(result.current[0]).toBeTruthy();
        expect(result.current[1]).toBeTruthy();        
        expect(callback).not.toHaveBeenCalled();      
        expect(setInterval).toHaveBeenCalledTimes(1);      
        expectIntervalCall(1, [expect.any(Function), 1000]);
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  

        jest.advanceTimersByTime(1000); 

        expect(callback).toHaveBeenCalledTimes(1);  
        expect(setInterval).toHaveBeenCalledTimes(1);   
        expectIntervalCall(1, [expect.any(Function), 1000]);     
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);  
               
        jest.advanceTimersByTime(1000); 

        expect(callback).toHaveBeenCalledTimes(2);  
        expect(setInterval).toHaveBeenCalledTimes(1);   
        expectIntervalCall(1, [expect.any(Function), 1000]);     
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);  
    });

    it('doesn\'t run if isRunning = false', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseThrottledRequestAnimationFrameParams, UseThrottledRequestAnimationFrameReturn>((args) => {
            return useThrottledRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
                1000,
                false,
            ],
        });
        

        expect(result.current).toBeTruthy();
        expect(result.current).toBeArrayOfSize(2);
        expect(result.current[0]).toBeTruthy();
        expect(result.current[1]).toBeTruthy();   
        expect(result.current[0].current).toBeNull();
        expect(result.current[1].current).toBeNull();   
        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  

        jest.advanceTimersByTime(0); 

        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  
    });

    it('doesn\'t do anything if timeout is NaN or not a number', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseThrottledRequestAnimationFrameParams, UseThrottledRequestAnimationFrameReturn>((args) => {
            return useThrottledRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
                NaN,
            ],
        });

        expect(result.current).toBeTruthy();
        expect(result.current).toBeArrayOfSize(2);
        expect(result.current[0]).toBeTruthy();
        expect(result.current[1]).toBeTruthy();   
        expect(result.current[0].current).toBeNull();
        expect(result.current[1].current).toBeNull();   
        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  

        jest.advanceTimersByTime(0); 

        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  
    });
    
});
