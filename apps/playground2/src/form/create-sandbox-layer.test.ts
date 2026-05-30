import { describe, expect, it } from "vitest";

import {
  createSandboxLayer,
  type PlaygroundLayerOptions,
} from "./create-sandbox-layer";

function makeState(
  overrides?: Partial<PlaygroundLayerOptions>,
): PlaygroundLayerOptions {
  return {
    schema: { type: "object", properties: { name: { type: "string" } } },
    uiSchema: {},
    initialValue: undefined,
    disabled: false,
    html5Validation: true,
    focusOnFirstError: false,
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
    ...overrides,
  };
}

describe("createPlaygroundLayer", () => {
  it("bare minimum", () => {
    expect(createSandboxLayer(makeState())).toMatchSnapshot();
  });

  it("with html5 validation off", () => {
    expect(
      createSandboxLayer(makeState({ html5Validation: false })),
    ).toMatchSnapshot();
  });

  it("with fields validation mode", () => {
    expect(
      createSandboxLayer(makeState({ fieldsValidationMode: 3 })),
    ).toMatchSnapshot();
  });

  it("with custom merger options", () => {
    expect(
      createSandboxLayer(makeState({ allOf: "populateDefaults" })),
    ).toMatchSnapshot();
  });

  it("with focus on first error", () => {
    expect(
      createSandboxLayer(makeState({ focusOnFirstError: true })),
    ).toMatchSnapshot();
  });

  it("with omit extra data", () => {
    expect(
      createSandboxLayer(makeState({ omitExtraData: true })),
    ).toMatchSnapshot();
  });

  it("with transparentLayout component", () => {
    expect(
      createSandboxLayer(
        makeState({
          uiSchema: { "ui:components": { layout: "transparentLayout" } },
        }),
      ),
    ).toMatchSnapshot();
  });

  it("with markdownDescription component", () => {
    expect(
      createSandboxLayer(
        makeState({
          uiSchema: {
            "ui:components": { description: "markdownDescription" },
          },
        }),
      ),
    ).toMatchSnapshot();
  });

  it("with string enum value mapper", () => {
    expect(
      createSandboxLayer(
        makeState({
          uiSchema: {
            "ui:options": {
              enumValueMapperBuilder: "registry:stringEnumValueMapper",
            },
          },
        }),
      ),
    ).toMatchSnapshot();
  });

  it("with everything enabled", () => {
    expect(
      createSandboxLayer(
        makeState({
          html5Validation: false,
          fieldsValidationMode: 7,
          focusOnFirstError: true,
          omitExtraData: true,
          allOf: "populateDefaults",
          uiSchema: {
            "ui:components": {
              layout: "transparentLayout",
              description: "markdownDescription",
            },
            "ui:options": {
              enumValueMapperBuilder: "registry:stringEnumValueMapper",
            },
          },
        }),
      ),
    ).toMatchSnapshot();
  });
});
