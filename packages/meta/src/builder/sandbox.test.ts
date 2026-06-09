import { describe, it, expect } from "vitest";

import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import { createSandboxFiles, type BuilderSandboxOptions } from "./sandbox.ts";
import { builderValidators } from "./model.ts";

const BASE_OPTIONS: BuilderSandboxOptions = {
  name: "Sandbox",
  theme: "basic",
  validator: "ajv8",
  schema: {
    type: "object",
    title: "Test",
    properties: { name: { type: "string" } },
  },
  uiSchema: {},
  icons: "none",
  widgets: [],
  fields: [],
};

function testCase(
  name: string,
  overrides: Partial<BuilderSandboxOptions> = {},
) {
  it(name, () => {
    expect(
      createSandboxFiles({ ...BASE_OPTIONS, ...overrides }),
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
    for (const validator of builderValidators()) {
      testCase(validator, { validator });
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
