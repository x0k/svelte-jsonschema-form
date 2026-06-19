import { describe, it, expect } from "vitest";

import { codegenThemeOrSubTheme } from "../codegen/model.ts";
import type { FormState } from "./form-state.ts";
import { playgroundValidators2, playgroundValidatorTitle } from "./model.ts";
import { createSandboxFiles, type CustomComponents } from "./sandbox.ts";

const BASE_FORM_STATE: FormState = {
  schema: {
    type: "object",
    title: "Test",
    properties: { name: { type: "string" } },
  },
  uiSchema: {},
  initialValue: undefined,
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
  resolver: "compat",
  arrayMinItemsPopulate: "all",
  arrayMinItemsMergeExtraDefaults: false,
  allOf: "skipDefaults",
  constAsDefault: "always",
  emptyObjectFields: "populateAllDefaults",
  mergeDefaultsIntoFormData: "useFormDataIfPresent",
};

const CUSTOM_COMPONENTS: CustomComponents = {
  markdownDescription: "<stub>markdown</stub>",
  transparentLayout: "<stub>transparent</stub>",
};

function testCase(name: string, overrides: Partial<FormState> = {}) {
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
      testCase(playgroundValidatorTitle(validator), { validator });
    }
  });

  describe("ui-schema", () => {
    testCase("customizations", {
      uiSchema: {
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
      },
    });

    testCase("refs", {
      uiSchema: {
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
      },
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
  });
});
