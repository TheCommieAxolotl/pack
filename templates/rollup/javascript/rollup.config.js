import { defineConfig } from 'rollup';

import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'esm',
    },
    plugins: [
        nodeResolve({
            exportConditions: ['node'],
        }),
    ],
});
