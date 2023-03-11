import { defineConfig } from "rollup";

import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default defineConfig({
    input: "src/index.ts",
    output: {
        dir: "dist",
        format: "esm",
    },
    plugins: [
        commonjs(),
        typescript(),
        nodeResolve({
            preferBuiltins: true,
            exportConditions: ["node"],
        }),
        json(),
        terser(),
        preserveShebangs(),
    ],
});
