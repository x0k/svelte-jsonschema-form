import { describe, it, expect } from "vitest";

import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import { jsonSchema } from "../playground/form-preset.ts";
import { builderValidators2, normalizeBuilderValidator } from "./model.ts";
import { createSandboxFiles, type BuilderSandboxOptions } from "./sandbox.ts";

const BASE_OPTIONS: BuilderSandboxOptions = {
  name: "Sandbox",
  theme: "basic",
  validator: normalizeBuilderValidator("ajv8"),
  schema: jsonSchema({
    type: "object",
    title: "Test",
    properties: { name: { type: "string" } },
  }),
  uiSchema: {},
  icons: "none",
  widgets: [],
  fields: [],
  html5Validation: false,
  resolver: "basic",
};

function testCase(
  name: string,
  overrides: Partial<BuilderSandboxOptions> = {}
) {
  it(name, async () => {
    expect(
      await createSandboxFiles({ ...BASE_OPTIONS, ...overrides })
    ).toMatchSnapshot();
  });
}

describe("builder sandbox-factory", () => {
  describe("basic", () => {
    testCase("basic");
  });

  describe("themes", () => {
    for (const theme of codegenThemeOrSubTheme()) {
      testCase(theme, { theme });
    }
  });

  describe("validators", () => {
    for (const validator of builderValidators2()) {
      const overrides: Partial<BuilderSandboxOptions> = { validator };
      if (validator.name === "zod4") {
        overrides.schema = `import * as z from "zod";\n\nexport default z.object({ name: z.string() })`;
      } else if (validator.name === "valibot") {
        overrides.schema = `import * as v from "valibot";\n\nexport default v.object({ name: v.string() })`;
      }
      testCase(validator.name, overrides);
    }
  });

  describe("ui-schema", () => {
    testCase("with uiSchema", {
      uiSchema: {
        "ui:components": {
          stringField: "enumField",
          arrayField: "multiEnumField",
        },
        properties: {
          name: {
            "ui:components": { textWidget: "textareaWidget" },
          },
        },
      },
    });
  });

  describe("widgets", () => {
    testCase("extra widgets", {
      widgets: ["textareaWidget", "rangeWidget"],
    });
  });

  describe("fields", () => {
    testCase("extra fields", {
      fields: ["file", "files"],
    });
  });
});
