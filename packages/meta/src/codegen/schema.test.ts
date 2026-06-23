import { describe, it, expect } from "vitest";

import { extractSchemaCode } from "./schema.ts";

describe("extractSchemaCode", () => {
  it("simple default export", () => {
    expect(
      extractSchemaCode(`export default { type: "string" }`)
    ).toMatchSnapshot();
  });

  it("default export with single import", () => {
    expect(
      extractSchemaCode(
        `import * as z from "zod";\n\nexport default z.string()`
      )
    ).toMatchSnapshot();
  });

  it("default export with multiple imports", () => {
    expect(
      extractSchemaCode(
        `import * as z from "zod";\nimport { refine } from "./utils";\n\nexport default z.object({ name: z.string() })`
      )
    ).toMatchSnapshot();
  });

  it("default export with import and type annotation", () => {
    expect(
      extractSchemaCode(
        `import * as v from "valibot";\n\nexport default v.object({ name: v.string() })`
      )
    ).toMatchSnapshot();
  });

  it("default export with arrow function expression", () => {
    expect(
      extractSchemaCode(`export default () => ({ type: "string" })`)
    ).toMatchSnapshot();
  });

  it("no default export returns entire input as both code and expression", () => {
    const input = `const x = 1;\nconst y = 2;`;
    expect(extractSchemaCode(input)).toMatchSnapshot();
  });

  it("named export only returns entire input as both code and expression", () => {
    const input = `export const schema = { type: "string" }`;
    expect(extractSchemaCode(input)).toMatchSnapshot();
  });

  it("default export with complex nested object", () => {
    expect(
      extractSchemaCode(
        `export default {\n  type: "object",\n  properties: {\n    name: { type: "string" },\n    age: { type: "number" }\n  }\n}`
      )
    ).toMatchSnapshot();
  });

  it("multiple statements before default export", () => {
    expect(
      extractSchemaCode(
        `const helper = (x: string) => x;\nconst schema = { type: "string" };\n\nexport default schema`
      )
    ).toMatchSnapshot();
  });

  it("default export with TypeScript generic", () => {
    expect(
      extractSchemaCode(
        `import * as z from "zod";\n\nexport default z.object<z.ZodRawShape>({ name: z.string() })`
      )
    ).toMatchSnapshot();
  });

  it("default export with conditional expression", () => {
    expect(
      extractSchemaCode(
        `const isDev = true;\n\nexport default isDev ? { type: "string" } : { type: "number" }`
      )
    ).toMatchSnapshot();
  });

  it("empty string input", () => {
    expect(extractSchemaCode(``)).toMatchSnapshot();
  });
});
