import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import terser from "@rollup/plugin-terser";
import * as pkg from "../../package.json";

const script = "swim-sys";

const external = [
  "@swim/util",
  "@swim/codec",
  "@swim/component",
  "fs",
  "path",
];

const beautify = terser({
  compress: false,
  mangle: false,
  output: {
    preamble: `// ${pkg.name} v${pkg.version} (c) ${pkg.copyright}`,
    beautify: true,
    comments: false,
    indent_level: 2,
  },
});

export default {
  input: "../../lib/main/index.js",
  output: [
    {
      file: `../../dist/${script}.mjs`,
      format: "esm",
      generatedCode: {
        preset: "es2015",
        constBindings: true,
      },
      sourcemap: true,
      plugins: [beautify],
    },
    {
      file: `../../dist/${script}.cjs`,
      format: "cjs",
      generatedCode: {
        preset: "es2015",
        constBindings: true,
      },
      sourcemap: true,
      interop: "esModule",
      plugins: [beautify],
    },
  ],
  external: external.concat("tslib"),
  plugins: [
    nodeResolve(),
    sourcemaps(),
  ],
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
};
