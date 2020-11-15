import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import multiInput from "rollup-plugin-multi-input";
import { terser } from "rollup-plugin-terser";

export default {
  input: ["src/extension.ts", "src/test/runTest.ts"],
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
    multiInput({ relative: "src/" }),
    nodeResolve({ preferBuiltins: true }),
    json(),
    typescript(),
    commonjs(),
    terser(),
  ],
};
