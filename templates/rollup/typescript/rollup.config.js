import { defineConfig } from 'rollup';

import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'esm',
    },
    plugins: [
        nodeResolve({
            exportConditions: ['node'],
        }),
        typescript(),
    ],
});
