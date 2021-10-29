// import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts'
import externals from "rollup-plugin-node-externals";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from "@rollup/plugin-node-resolve";
import typescript from 'rollup-plugin-typescript2'

import pkg from "./package.json";

// Extensions handled by babel:
const EXTENSIONS = [".ts", ".tsx"];

// Exclude dev dependencies:
const EXTERNAL = [...Object.keys(pkg.devDependencies), /\.s?css$/];

export default [{
    input: 'src/index.ts',

    output: [{            
        // file: pkg.module,
        dir: "dist/esm",
        sourcemap: true,
        format: "esm",
        preserveModules: true, // Enables treeshaking
    }, {
        // file: pkg.main,
        dir: "dist/cjs",
        sourcemap: true,
        format: "cjs",
        preserveModules: true, // Enables treeshaking
    }],

    // preserveModules: true,

    plugins: [
        peerDepsExternal(), // https://rollupjs.org/guide/en/#peer-dependencies
        
        externals({ deps: true }), // TODO: This could replace external: EXTERNAL with peerDeps: true. See https://www.npmjs.com/package/rollup-plugin-node-externals.
        
        resolve(), 
        
        commonjs({                
            exclude: 'node_modules',
            ignoreGlobal: true,
        }),

        typescript({ useTsconfigDeclarationDir: true }),

        babel({
            extensions: EXTENSIONS,  // Compile our TypeScript files
            babelHelpers: "inline",  // Place babel helper functions in the same file they were used
            include: EXTENSIONS.map(ext => `src/**/*${ext}`)
        }),

        // terser()
    ],

    external: EXTERNAL, // https://rollupjs.org/guide/en/#peer-dependencies
}, {
    input: './dist/types/index.d.ts',
    output: [{ file: './dist/index.d.ts', format: "esm" }],
    external: EXTERNAL,
    plugins: [dts()],
}];
