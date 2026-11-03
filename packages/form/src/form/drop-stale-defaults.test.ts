import { beforeEach, describe, expect, it } from "vitest";

import type { Merger, Schema, SchemaValue, Validator } from "#core/index.js";
import { createMerger } from "#core/test-merger.js";
import { createValidator } from "#core/test-validator.js";

import { dropStaleDefaults } from "./drop-stale-defaults.js";
import type { FieldPath } from "./id.js";
import type { FormValueChange } from "./merger.js";
import type { FieldValue } from "./model.js";

let testValidator: Validator;
let defaultMerger: Merger;

beforeEach(() => {
  testValidator = createValidator({
    cases: [
      {
        schema: { properties: { mode: { const: "a" } } },
        value: { mode: "a", x: "a" },
        result: true,
      },
      {
        schema: { properties: { mode: { const: "a" } } },
        value: { mode: "b", x: "a" },
        result: false,
      },
    ],
  });
  defaultMerger = createMerger();
});

function path(...parts: (string | number)[]) {
  return parts as unknown as FieldPath;
}

function change(path: FieldPath, oldValue: FieldValue): FormValueChange {
  return { path, oldValue };
}

function drop({
  oldSchema,
  newSchema,
  formData,
  changes,
}: {
  oldSchema: Schema;
  newSchema: Schema;
  formData: SchemaValue;
  changes: FormValueChange[];
}) {
  return dropStaleDefaults(defaultMerger, {
    validator: testValidator,
    rootSchema: oldSchema,
    newSchema,
    formData,
    changes,
  });
}

const oldSchema: Schema = {
  type: "object",
  properties: {
    mode: { type: "string" },
    value: {
      type: "object",
      properties: {
        branch: { type: "string", default: "first" },
      },
      default: { branch: "first" },
    },
  },
};

const newSchema: Schema = {
  type: "object",
  properties: {
    mode: { type: "string" },
    value: {
      type: "object",
      properties: {
        branch: { type: "string", default: "second" },
      },
      default: { branch: "second" },
    },
  },
};

describe("dropStaleDefaults", () => {
  it("removes an object property that still holds the swapped-away branch's default", () => {
    const formData = { mode: "second", value: { branch: "first" } };

    expect(
      drop({
        oldSchema,
        newSchema,
        formData,
        changes: [change(path("mode"), "first")],
      })
    ).toEqual({ mode: "second" });
  });

  it("keeps a value the user changed away from the old default", () => {
    const formData = { mode: "second", value: { branch: "edited" } };

    expect(
      drop({
        oldSchema,
        newSchema,
        formData,
        changes: [change(path("mode"), "first")],
      })
    ).toBe(formData);
  });

  it("keeps a value when both branches declare the same default", () => {
    const formData = { mode: "second", value: { branch: "first" } };

    expect(
      drop({
        oldSchema,
        newSchema: oldSchema,
        formData,
        changes: [change(path("mode"), "first")],
      })
    ).toBe(formData);
  });

  it("removes a stale default nested in an object property", () => {
    const oldNestedSchema: Schema = {
      type: "object",
      properties: {
        cfg: {
          type: "object",
          properties: {
            kind: {
              type: "object",
              properties: {
                branch: { type: "string", default: "first" },
              },
              default: { branch: "first" },
            },
          },
        },
      },
    };
    const newNestedSchema: Schema = {
      type: "object",
      properties: {
        cfg: {
          type: "object",
          properties: {
            kind: {
              type: "object",
              properties: {
                branch: { type: "string", default: "second" },
              },
              default: { branch: "second" },
            },
          },
        },
      },
    };

    expect(
      drop({
        oldSchema: oldNestedSchema,
        newSchema: newNestedSchema,
        formData: { cfg: { kind: { branch: "first" } } },
        changes: [],
      })
    ).toEqual({ cfg: {} });
  });

  it("removes a stale parent-level default without deleting sibling fields", () => {
    const oldParentSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        value: { type: "string" },
      },
      default: { value: "first" },
    };
    const newParentSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        value: { type: "string" },
      },
      default: { value: "second" },
    };

    expect(
      drop({
        oldSchema: oldParentSchema,
        newSchema: newParentSchema,
        formData: { mode: "second", value: "first" },
        changes: [change(path("mode"), "first")],
      })
    ).toEqual({ mode: "second" });
  });

  it("does not remove the value under the changed path", () => {
    const oldChangedSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string", default: "first" },
        value: { type: "string" },
      },
      default: { mode: "first" },
    };
    const newChangedSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string", default: "second" },
        value: { type: "string" },
      },
      default: { mode: "second" },
    };

    expect(
      drop({
        oldSchema: oldChangedSchema,
        newSchema: newChangedSchema,
        formData: { mode: "user", value: "kept" },
        changes: [change(path("mode"), "first")],
      })
    ).toEqual({ mode: "user", value: "kept" });
  });

  it("does not remove a value changed earlier in the same batch", () => {
    const oldBatchSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        value: { type: "string" },
      },
      default: { value: "first" },
    };
    const newBatchSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        value: { type: "string" },
      },
      default: { value: "second" },
    };

    expect(
      drop({
        oldSchema: oldBatchSchema,
        newSchema: newBatchSchema,
        formData: { mode: "second", value: "edited" },
        changes: [
          change(path("value"), "first"),
          change(path("mode"), "first"),
        ],
      })
    ).toEqual({ mode: "second", value: "edited" });
  });

  it("does not treat a sibling with the same key name as changed", () => {
    const oldSiblingSchema: Schema = {
      type: "object",
      properties: {
        first: {
          type: "object",
          properties: { x: { type: "string" } },
        },
        second: {
          type: "object",
          properties: { x: { type: "string", default: "old" } },
        },
      },
    };
    const newSiblingSchema: Schema = {
      type: "object",
      properties: {
        first: {
          type: "object",
          properties: { x: { type: "string" } },
        },
        second: {
          type: "object",
          properties: { x: { type: "string", default: "new" } },
        },
      },
    };

    expect(
      drop({
        oldSchema: oldSiblingSchema,
        newSchema: newSiblingSchema,
        formData: { first: { x: "edited" }, second: { x: "old" } },
        changes: [change(path("first", "x"), "edited")],
      })
    ).toEqual({ first: { x: "edited" }, second: {} });
  });

  it("resolves a nested conditional against the data before the change", () => {
    const wrapperBase: Schema = {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["a", "b"] },
      },
    };
    const thenBranch: Schema = {
      properties: {
        x: { type: "string", default: "a" },
      },
    };
    const elseBranch: Schema = {
      properties: {
        x: { type: "string", default: "b" },
      },
    };
    const nestedConditionalSchema: Schema = {
      type: "object",
      properties: {
        wrapper: {
          ...wrapperBase,
          if: {
            properties: {
              mode: { const: "a" },
            },
          },
          then: thenBranch,
          else: elseBranch,
        },
      },
    };
    defaultMerger = createMerger({
      merges: [
        {
          left: wrapperBase,
          right: thenBranch,
          result: {
            ...wrapperBase,
            properties: { ...wrapperBase.properties, ...thenBranch.properties },
          },
        },
        {
          left: wrapperBase,
          right: elseBranch,
          result: {
            ...wrapperBase,
            properties: { ...wrapperBase.properties, ...elseBranch.properties },
          },
        },
      ],
    });

    expect(
      drop({
        oldSchema: nestedConditionalSchema,
        newSchema: nestedConditionalSchema,
        formData: { wrapper: { mode: "b", x: "a" } },
        changes: [change(path("wrapper", "mode"), "a")],
      })
    ).toEqual({ wrapper: { mode: "b" } });
  });

  it("removes a prototype-named stale default without touching the prototype", () => {
    const oldProtoSchema = JSON.parse(
      '{"type":"object","properties":{"__proto__":{"type":"string","default":"old"}}}'
    ) as Schema;
    const newProtoSchema = JSON.parse(
      '{"type":"object","properties":{"__proto__":{"type":"string","default":"new"}}}'
    ) as Schema;
    const formData = JSON.parse('{"__proto__":"old"}');
    const result = drop({
      oldSchema: oldProtoSchema,
      newSchema: newProtoSchema,
      formData,
      changes: [],
    });

    expect(Object.hasOwn(result as object, "__proto__")).toBe(false);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
