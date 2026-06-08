import { describe, it, expect } from "vitest";
import type { UiSchemaRoot } from "@sjsf/form";

import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import {
  createSandboxFiles,
  type CustomComponentSources,
} from "./sandbox-factory.ts";
import type { FormState } from "./form-state.ts";
import { playgroundValidators } from "./model.ts";

type SandboxVariant = {
  name: string;
} & Partial<FormState>;

const BASE: SandboxVariant = {
  name: "basic",
};

function* getVariants(): Generator<SandboxVariant> {
  yield BASE;
  for (const theme of codegenThemeOrSubTheme()) {
    if (theme === BASE.theme) continue;
    yield { name: `theme:${theme}`, theme };
  }
  for (const validator of playgroundValidators()) {
    if (validator === BASE.validator) continue;
    yield {
      name: `validator:${validator}`,
      validator,
    };
  }
  yield {
    name: "component:markdownDescription",
    uiSchema: {
      "ui:components": { description: "markdownDescription" },
    },
  };
  yield {
    name: "component:transparentLayout",
    uiSchema: {
      "ui:components": { layout: "transparentLayout" },
    },
  };
  yield {
    name: "component:stringEnumValueMapper",
    uiSchema: {
      "ui:options": {
        enumValueMapperBuilder: "registry:stringEnumValueMapper",
      },
    },
  };
  yield {
    name: "merger:non-default",
    allOf: "populateDefaults",
    emptyObjectFields: "skipDefaults",
  };
  yield {
    name: "form:disabled",
    disabled: true,
  };
  yield {
    name: "form:omitExtraData",
    omitExtraData: true,
  };
}

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
  validator: "ajv8",
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

const defaultSources: CustomComponentSources = {
  markdownDescription: "<stub>markdown</stub>",
  transparentLayout: "<stub>transparent</stub>",
};

describe("sandbox-factory", () => {
  const variants = Array.from(getVariants());
  for (const { name, ...overrides } of variants) {
    it(name, () => {
      expect(
        createSandboxFiles(
          { ...BASE_FORM_STATE, ...overrides },
          defaultSources,
        ),
      ).toMatchSnapshot();
    });
  }
});
