corre
=====

🏃‍♂️ Declaratively control how and when your code is executed. Hooks for setTimeout, setInterval, rAF and more!

<br>


Installation
------------

    npm install @swyg/corre

    yarn install @swyg/corre

<br>

    
Usage
-----

**Functions:**

- `useTimeout(callback: EffectCallback, delay: number | null, deps: React.DependencyList = []): MutableRefObject<number | null>`
- `useInterval(callback: EffectCallback, delay: number | null, deps: React.DependencyList = []): MutableRefObject<number | null>`
- `useRequestAnimationFrame(callback: EffectCallback, isRunning: boolean): MutableRefObject<number | null>`
- `useThrottledCallback<A extends any[]>(callback: (...args: A) => void, delay: number, deps: DependencyList = [], options: UseThrottledCallbackOptions = {}): (...args: A) => void`
- `useThrottledRequestAnimationFrame(callback: EffectCallback, delay: number | null): [MutableRefObject<number | null>, MutableRefObject<number | null>]`

<br>

Attribution / Inspiration
-------------------------

- https://overreacted.io/making-setinterval-declarative-with-react-hooks/
- https://stackoverflow.com/questions/53024496/state-not-updating-when-using-react-state-hook-within-setinterval/59274004#59274004
- https://gist.github.com/Danziger/336e75b6675223ad805a88c2dfdcfd4a
- https://stackoverflow.com/a/59274004/3723993
