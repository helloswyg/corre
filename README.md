<br />


<h1 align="center">🏃‍♂️ Corre</h1>

<br /><br />


<p align="center">
  🏃‍♂️ Declaratively control how and when your code is executed. Hooks for setTimeout, setInterval, rAF and more!
</p>

<br />


<p align="center">
  <a href="https://www.npmjs.com/package/@swyg/corre" target="_blank">
    <img src="https://img.shields.io/npm/v/@swyg/corre?color=%23CC3534&style=for-the-badge" />
  </a>
</p>

<br />


Installation
------------

    npm install @swyg/corre

    yarn install @swyg/corre

<br />

    
Usage
-----

### `useTimeout(...)`

Calls `window.setTimeout(...)` declaratively.

```TSX
const timeoutRef = useTimeout(
    callback: EffectCallback,
    delay: number | null,
    deps: React.DependencyList = [],
): MutableRefObject<number | null>;
```

If `delay === null`, the timer won't be set; if it's already set, it will be cleared.

If `deps` are passed, anytime any of them change, the previous timer will be cleared and a new one will be set. This means that:

- If no `deps` are passed (and this never changes), the callback will be called only once.
- If `deps` change faster than `delay`, the `callback` will never be called.

Note `callback` is stored in a `ref`, so you don't need to pass its dependencies as `deps` if you don't want the behavior just described.

<br />


### `useInterval(...)`

Calls `window.setInterval(...)` declaratively.

```TSX
const intervalRef = useInterval(
    callback: EffectCallback,
    delay: number | null,
    deps: React.DependencyList = [],
): MutableRefObject<number | null>
```

If `delay === null`, the timer won't be set; if it's already set, it will be cleared.

If `deps` are passed, anytime any of them change, the previous timer will be cleared and a new one will be set. This means that:

- If `deps` change faster than `delay`, the `callback` will never be called.

Note `callback` is stored in a `ref`, so you don't need to pass its dependencies as `deps` if you don't want the behavior just described.

<br />


### `useRequestAnimationFrame(...)` aliased `useRAF(...)`

Calls `window.requestAnimationFrame(...)` declaratively.

```TSX
const rafRef = useRequestAnimationFrame(
    callback: EffectCallback,
    isRunning: boolean,
): MutableRefObject<number | null>;
```

If `isRunning === null`, `requestAnimationFrame` won't be called; if it's already been called, it will be cancelled.

<br />


### `useThrottledRequestAnimationFrame(...)` aliased `useThrottledRAF(...)`

Calls `window.requestAnimationFrame(...)` wrapped in `window.setInterval(...)` declaratively.

This means this `callback` will be called through `window.requestAnimationFrame(...)` once every `delay` ms.

```TSX
const [intervalRef, rafRef] = useThrottledRequestAnimationFrame(
    callback: EffectCallback,
    delay: number | null,
    isRunning: boolean = true,
): [
    MutableRefObject<number | null>,
    MutableRefObject<number | null>,
];
```

If `delay === null` or `isRunning === null`, the timer won't be set and `requestAnimationFrame` won't be called; if it's already set / it has already been called, it will be cleared, they'll be cleared / cancelled.

If `deps` are passed, anytime any of them change, the previous timer will be cleared and a new one will be set. This means that:

- If `deps` change faster than `delay`, the `callback` will never be called.

<br />


### `useThrottledCallback(...)`

Returns a throttled version of `callback` that, when called:

- Calls the original `callback` if it's been more than `delay` ms since the last call.
- Uses `setTimeout` to call the `original` callback once `delay` ms have passed since the last call.

```TSX
const throttledFn = useThrottledCallback<A extends any[]>(
    callback: (...args: A) => void,
    delay: number,
    deps: DependencyList = [],
    options: { makeResponsive: boolean } = {}
): (...args: A) => void;
```

If `deps` are passed, anytime any of them change, the previous timer will be cleared. This means that:

- Any pending invocation of `callback` won't happen (unless the throttled function is called again).
- If `deps` change faster than `delay`, the `callback` will never be called.

Note `callback` is stored in a `ref`, so you don't need to pass its dependencies as `deps` if you don't want the behavior just described.

<br />


Attribution / Inspiration
-------------------------

- https://overreacted.io/making-setinterval-declarative-with-react-hooks/
- https://stackoverflow.com/questions/53024496/state-not-updating-when-using-react-state-hook-within-setinterval/59274004#59274004
- https://gist.github.com/Danziger/336e75b6675223ad805a88c2dfdcfd4a
- https://stackoverflow.com/a/59274004/3723993
