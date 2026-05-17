import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["main.js"],
  bundle: true,
  outfile: "C:/DVDs Vault/.obsidian/plugins/just-enough-meta/main.js",
  format: "cjs",
  target: "es2018",
  platform: "browser",
  external: ["obsidian"],
}).catch(() => process.exit(1));