
import { renderHook } from '@testing-library/react-hooks'
import { useRequestAnimationFrame, UseRequestAnimationFrameParams, UseRequestAnimationFrameReturn } from './raf.hook';


describe('useRequestAnimationFrame()', () => {
    
    beforeAll(() => {
        jest.useFakeTimers('legacy');
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => setTimeout(cb, 1));
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);  
    });

    afterEach(() => {
        // jest.useRealTimers();
        
        // jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it('runs if isRunning = true', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseRequestAnimationFrameParams, UseRequestAnimationFrameReturn>((args) => {
            return useRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
            ],
        });
        
        expect(result.current.current).toBeTruthy();
        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);  

        jest.advanceTimersByTime(1); 

        expect(callback).toHaveBeenCalledTimes(1);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);  
               
        jest.advanceTimersByTime(1); 
                
        expect(callback).toHaveBeenCalledTimes(2);    
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(3);  

        jest.advanceTimersByTime(1); 
                
        expect(callback).toHaveBeenCalledTimes(3);    
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(4);  
    });

    it('doesn\'t run if isRunning = false', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseRequestAnimationFrameParams, UseRequestAnimationFrameReturn>((args) => {
            return useRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
                false,
            ],
        });
        
        expect(result.current.current).toBeNull();
        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  

        jest.advanceTimersByTime(0); 

        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(0);  
    });
    
});
