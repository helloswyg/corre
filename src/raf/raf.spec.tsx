
import { renderHook } from '@testing-library/react-hooks'
import { useRequestAnimationFrame, UseRequestAnimationFrameParams, UseRequestAnimationFrameReturn } from './raf.hook';

jest.useFakeTimers();

jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: Function) => setTimeout(cb));
jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

describe('useRequestAnimationFrame()', () => {
    
    it('runs', () => {
        const callback = jest.fn();

        const { result, rerender } = renderHook<UseRequestAnimationFrameParams, UseRequestAnimationFrameReturn>((args) => {
            return useRequestAnimationFrame(...args);
        }, {
            initialProps: [
                callback,
                true,
            ],
        });
        
        expect(result.current.current).toBeTruthy();
        expect(callback).toHaveBeenCalledTimes(0);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);  

        jest.advanceTimersByTime(0); 

        expect(callback).toHaveBeenCalledTimes(1);      
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);  
               
        jest.advanceTimersByTime(1); 
                
        expect(callback).toHaveBeenCalledTimes(2);    
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(3);  

        jest.advanceTimersByTime(1); 
                
        expect(callback).toHaveBeenCalledTimes(3);    
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(4);  

    });
    
});
