import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/extension.ts",
  output: [
    {
      dir: "./out",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
  ],
  external: ["vscode"],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    json(),
    typescript({ module: "ES2015" }),
    commonjs(),
    terser(),
  ],
};
