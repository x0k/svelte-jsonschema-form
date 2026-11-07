import { beforeEach, describe, expect, it } from "vitest";

import {
  getDefaultFormState,
  isOrderedSchemaDeepEqual,
  type Merger,
  type Schema,
  type SchemaValue,
  type Validator,
  type ValueDeepComparator,
} from "#core/index.js";
import { createMerger } from "#core/test-merger.js";
import { createValidator } from "#core/test-validator.js";

import { dropStaleDefaults } from "./drop-stale-defaults.js";
import type { FieldPath } from "./id.js";
import type { FormMerger, FormValueChange } from "./merger.js";
import type { FieldValue } from "./model.js";

let testValidator: Validator;

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
});

function path(...parts: (string | number)[]) {
  return parts as unknown as FieldPath;
}

function change(path: FieldPath, oldValue: FieldValue): FormValueChange {
  return { path, oldValue };
}

function formMerger(merger: Merger, rootSchema: Schema): FormMerger {
  const formMerger: FormMerger = {
    ...merger,
    mergeFormDataAndSchemaDefaults({
      schema,
      formData,
      initialDefaultsGenerated = false,
      includeUndefinedValues = false,
    }) {
      return getDefaultFormState(
        testValidator,
        merger,
        schema,
        formData,
        rootSchema,
        includeUndefinedValues,
        {},
        initialDefaultsGenerated
      );
    },
    dropStaleDefaults(options) {
      return dropStaleDefaults(formMerger, options);
    },
  };
  return formMerger;
}

function drop({
  oldSchema,
  newSchema,
  formData,
  changes,
  merger = createMerger(),
}: {
  oldSchema: Schema;
  newSchema: Schema;
  formData: SchemaValue;
  changes: FormValueChange[];
  merger?: Merger;
}) {
  return dropStaleDefaults(formMerger(merger, oldSchema), {
    validator: testValidator,
    rootSchema: oldSchema,
    newSchema,
    formData,
    changes,
  }).formData;
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

  it("reports the dropped value and the schema it was written under", () => {
    const formData = { mode: "second", value: { branch: "first" } };
    const result = dropStaleDefaults(formMerger(createMerger(), oldSchema), {
      validator: testValidator,
      rootSchema: oldSchema,
      newSchema,
      formData,
      changes: [change(path("mode"), "first")],
    });

    expect(result.formData).toEqual({ mode: "second" });
    expect(result.dropped).toHaveLength(1);
    expect(result.dropped[0]).toMatchObject({
      path: path("value"),
      value: { branch: "first" },
      writtenUnder: { default: { branch: "second" } },
    });
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
    const merger = createMerger({
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
        merger,
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

  it("treats a null property default as a declared default", () => {
    const oldNullSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { type: "null", default: null },
      },
    };
    const newNullSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { type: "string", default: "b" },
      },
    };

    expect(
      drop({
        oldSchema: oldNullSchema,
        newSchema: newNullSchema,
        formData: { mode: "b", x: null },
        changes: [change(path("mode"), "a")],
      })
    ).toEqual({ mode: "b" });
  });

  it("treats a null property const as a declared default", () => {
    const oldNullSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { const: null },
      },
    };
    const newNullSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { type: "string", default: "b" },
      },
    };

    expect(
      drop({
        oldSchema: oldNullSchema,
        newSchema: newNullSchema,
        formData: { mode: "b", x: null },
        changes: [change(path("mode"), "a")],
      })
    ).toEqual({ mode: "b" });
  });

  it("prefers a null property declaration over the level default", () => {
    const oldLevelSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { type: "null", default: null },
      },
      default: { x: "a" },
    };
    const newLevelSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        x: { type: "string", default: "b" },
      },
      default: { x: "b" },
    };

    expect(
      drop({
        oldSchema: oldLevelSchema,
        newSchema: newLevelSchema,
        formData: { mode: "b", x: null },
        changes: [change(path("mode"), "a")],
      })
    ).toEqual({ mode: "b" });
  });

  it("uses the merger's value comparer", () => {
    const oldOrderedSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        cfg: { type: "object", default: { a: 1, b: 2 } },
      },
    };
    const orderedMerger: FormMerger = {
      ...formMerger(createMerger(), oldOrderedSchema),
      isValueDeepEqual: isOrderedSchemaDeepEqual as ValueDeepComparator,
    };
    const newOrderedSchema: Schema = {
      type: "object",
      properties: {
        mode: { type: "string" },
        cfg: { type: "object", default: { a: 1, b: 3 } },
      },
    };
    const formData = { mode: "b", cfg: { b: 2, a: 1 } };

    expect(
      dropStaleDefaults(orderedMerger, {
        validator: testValidator,
        rootSchema: oldOrderedSchema,
        newSchema: newOrderedSchema,
        formData,
        changes: [change(path("mode"), "a")],
      }).formData
    ).toBe(formData);
  });

  it("keeps values supplied by a whole-object change", () => {
    const formData = { mode: "second", value: { branch: "first" } };

    expect(
      drop({
        oldSchema,
        newSchema,
        formData,
        changes: [
          change(path(), { mode: "first", value: { branch: "first" } }),
        ],
      })
    ).toBe(formData);
  });

  it("keeps values below a whole-object change", () => {
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
    const formData = { cfg: { kind: { branch: "first" } } };

    expect(
      drop({
        oldSchema: oldNestedSchema,
        newSchema: newNestedSchema,
        formData,
        changes: [change(path("cfg"), { kind: { branch: "first" } })],
      })
    ).toBe(formData);
  });
});
