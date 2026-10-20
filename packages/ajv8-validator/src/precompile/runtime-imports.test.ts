import { resolve } from "node:path";

import { build } from "esbuild";
import { describe, expect, it } from "vitest";

describe("precompile entry", () => {
  it("does not bundle ajv at runtime", async () => {
    const result = await build({
      entryPoints: [resolve(import.meta.dirname, "index.ts")],
      bundle: true,
      write: false,
      metafile: true,
      format: "esm",
      platform: "browser",
      logLevel: "silent",
    });
    const ajvInputs = Object.keys(result.metafile!.inputs).filter((input) =>
      /(?:^|\/)ajv(?:@|\/)/.test(input)
    );
    expect(ajvInputs).toEqual([]);
  });
});
