import { ON_INPUT, ON_CHANGE } from "@sjsf/form";
import { describe, it, expect } from "vitest";

import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import { jsonSchema, jsonUiSchema, jsonValue } from "./form-preset.ts";
import type { NormalizedFormState } from "./form-state.ts";
import { playgroundValidators2, playgroundValidatorTitle } from "./model.ts";
import { createSandboxFiles, type CustomComponents } from "./sandbox.ts";

const BASE_FORM_STATE: NormalizedFormState = {
  schema: jsonSchema({
    type: "object",
    title: "Test",
    properties: { name: { type: "string" } },
  }),
  uiSchema: jsonUiSchema({}),
  initialValue: jsonValue(null),
  css: "",
  disabled: false,
  html5Validation: false,
  focusOnFirstError: true,
  omitExtraData: false,
  fieldsValidationMode: 0,
  validator: {
    name: "ajv8",
    precompiled: false,
    draft2020: false,
  },
  theme: "basic",
  icons: "none",
  resolver: "basic",
  arrayMinItemsPopulate: "all",
  arrayMinItemsMergeExtraDefaults: false,
  allOf: "skipDefaults",
  constAsDefault: "always",
  emptyObjectFields: "populateAllDefaults",
  mergeDefaultsIntoFormData: "useFormDataIfPresent",
  nestedDefaultsPrecedence: "descendantWins",
};

const CUSTOM_COMPONENTS: CustomComponents = {
  markdownDescription: "<stub>markdown</stub>",
  transparentLayout: "<stub>transparent</stub>",
};

function testCase(name: string, overrides: Partial<NormalizedFormState> = {}) {
  it(name, async () => {
    expect(
      await createSandboxFiles({
        name: "Sandbox",
        formState: { ...BASE_FORM_STATE, ...overrides },
        customComponents: CUSTOM_COMPONENTS,
      })
    ).toMatchSnapshot();
  });
}

describe("sandbox-factory", () => {
  describe("basic", () => {
    testCase("basic");
  });

  describe("themes", () => {
    for (const theme of codegenThemeOrSubTheme()) {
      testCase(theme, { theme });
    }
  });

  describe("validators", () => {
    for (const validator of playgroundValidators2()) {
      const overrides: Partial<NormalizedFormState> = { validator };
      if (validator.name === "zod4") {
        overrides.schema = `import * as z from "zod";\n\nexport default z.object({ name: z.string() })`;
      } else if (validator.name === "valibot") {
        overrides.schema = `import * as v from "valibot";\n\nexport default v.object({ name: v.string() })`;
      }
      testCase(playgroundValidatorTitle(validator), overrides);
    }
  });

  describe("ui-schema", () => {
    testCase("customizations", {
      uiSchema: jsonUiSchema({
        "ui:components": {
          stringField: "enumField",
          arrayField: "multiEnumField",
          description: "markdownDescription",
          layout: "transparentLayout",
          numberWidget: "rangeWidget",
        },
        "ui:options": {
          enumValueMapperBuilder: "registry:stringEnumValueMapper",
        },
        properties: {
          name: {
            "ui:components": { textWidget: "textareaWidget" },
          },
        },
      }),
    });

    testCase("refs", {
      uiSchema: jsonUiSchema({
        "ui:definitions": {
          customField: {
            "ui:components": { stringField: "enumField" },
            "ui:options": {
              enumValueMapperBuilder: "registry:stringEnumValueMapper",
            },
          },
          customLayout: {
            "ui:components": { layout: "transparentLayout" },
          },
        },
        name: { $ref: "customField" },
        email: { $ref: "customField" },
        address: { $ref: "customLayout" },
      }),
    });
  });

  describe("merger", () => {
    testCase("non-default", {
      allOf: "populateDefaults",
      emptyObjectFields: "skipDefaults",
    });
  });

  describe("form", () => {
    testCase("disabled", {
      disabled: true,
    });

    testCase("omitExtraData", {
      omitExtraData: true,
    });

    testCase("fieldsValidationMode", {
      fieldsValidationMode: ON_INPUT | ON_CHANGE,
      validator: {
        name: "schemasafe",
        precompiled: true,
        draft2020: false,
      },
    });
  });

  describe("css", () => {
    testCase("custom css", {
      css: "body { background: red; }",
    });
  });
});
