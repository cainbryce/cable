import {
  argv,
  build,
  type BuildConfig,
  type BuildMetafile,
  type BuildOutput,
} from "bun";

const [, , ..._args]: string[] = argv;
build({
  entrypoints: ["index.ts", ..._args],
  bytecode: false,
  target: "bun",
  throw: true,
  tsconfig: "./tsconfig.json",
  sourcemap: "inline",
  splitting: true,
  env: "inline",
  outdir: "./dist",
  format: "esm",
  metafile: true,
} as BuildConfig)
  .then((_r: BuildOutput) => {
    if (_r) {
      const bmf: BuildMetafile = _r.metafile!;
      let _oo = null;
      if (_r.outputs.length > 0) {
        _oo = [..._r.outputs];
      }
      console.group({
        Outputs: _oo ?? bmf.outputs,
        Inputs: bmf.inputs,
        Logs: _r.logs,
        Success: _r.success,
      });
    }
  })
  .catch((e: Error) => {
    console.group({
      Name: e.name,
      Error: e.message,
      Cause: e.cause,
      Stack: e.stack,
    });
  });
