// import { terser } from 'rollup-plugin-terser'
// import { visualizer } from 'rollup-plugin-visualizer';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts'
import externals from "rollup-plugin-node-externals";
import resolve from "@rollup/plugin-node-resolve";
import typescript from 'rollup-plugin-typescript2';

export default [{
    input: 'src/index.ts',

    output: [{            
        dir: "dist/esm",
        sourcemap: true,
        format: "esm",
        preserveModules: true, // Enables treeshaking
        globals: {
          react: "React",
        },
        exports: "named",
    }, {
        dir: "dist/cjs",
        sourcemap: true,
        format: "cjs",
        preserveModules: true, // Enables treeshaking
        globals: {
          react: "React",
        },
        exports: "named",
    }],

    plugins: [
        externals(), // See https://www.npmjs.com/package/rollup-plugin-node-externals.

        resolve({
            // Warn if some modules are not going to be imported properly (such as the ones added manually to the EXTERNAL array above):
            modulesOnly: true,
        }),
        
        commonjs({                
            // exclude: 'node_modules',
            ignoreGlobal: true,
        }),

        typescript({ useTsconfigDeclarationDir: true }),

        // terser(),

        // visualizer(),
    ],
}, {
    input: './dist/types/index.d.ts',
    output: [{ file: './dist/index.d.ts', format: "esm" }],
    plugins: [dts()],
}];
