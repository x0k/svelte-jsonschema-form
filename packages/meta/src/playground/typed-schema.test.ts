/// <reference types="node" />
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, it, expect, vi, afterAll } from "vitest";

import type { SchemaType, TypedSchema } from "./typed-schema.ts";

const tmpDir = await mkdtemp(join(tmpdir(), "typed-schema-test-"));

vi.mock("../modules.ts", () => ({
  encodeModule(code: string) {
    return code;
  },
  async importModule<M>(code: string): Promise<M> {
    const filePath = join(
      tmpDir,
      `${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`
    );
    await writeFile(filePath, code);
    try {
      return (await import(filePath)) as M;
    } finally {
      await rm(filePath, { force: true });
    }
  },
}));

const { convertTypedSchema } = await import("./typed-schema.ts");

afterAll(async () => {
  await rm(tmpDir, { recursive: true, force: true });
});

const JSON_DRAFT7_SCHEMA = `export default { type: "object", properties: { name: { type: "string" } } }`;

const JSON_DRAFT2020_SCHEMA = `export default { "$schema": "https://json-schema.org/draft/2020-12/schema", type: "object", properties: { items: { type: "array", prefixItems: [{ type: "string" }], items: { type: "number" } } }, unevaluatedProperties: false }`;

const ZOD_SCHEMA = `import * as z from "zod";\n\nexport default z.object({ name: z.string() })`;

const VALIBOT_SCHEMA = `import * as v from "valibot";\n\nexport default v.object({ name: v.string() })`;

const TARGETS: { label: string; target: SchemaType }[] = [
  { label: "json (draft7)", target: { type: "json", draft2020: false } },
  { label: "json (draft2020)", target: { type: "json", draft2020: true } },
  { label: "zod", target: { type: "zod" } },
  { label: "valibot", target: { type: "valibot" } },
];

const SOURCES: { label: string; source: TypedSchema }[] = [
  {
    label: "json (draft7)",
    source: { type: "json", schema: JSON_DRAFT7_SCHEMA },
  },
  {
    label: "json (draft2020)",
    source: { type: "json", schema: JSON_DRAFT2020_SCHEMA },
  },
  { label: "zod", source: { type: "zod", schema: ZOD_SCHEMA } },
  { label: "valibot", source: { type: "valibot", schema: VALIBOT_SCHEMA } },
];

describe("convertTypedSchema", () => {
  for (const { label: sourceLabel, source } of SOURCES) {
    describe(`from ${sourceLabel}`, () => {
      for (const { label: targetLabel, target } of TARGETS) {
        it(`to ${targetLabel}`, async () => {
          expect(
            await convertTypedSchema({ source, target })
          ).toMatchSnapshot();
        });
      }
    });
  }
});
