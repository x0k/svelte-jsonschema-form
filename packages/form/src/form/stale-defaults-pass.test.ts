import { describe, expect, it } from "vitest";

import {
  createCoreContext,
  getDefaultFormState,
  type Merger,
  type Schema,
} from "#core/index.js";
import { createMerger, createValidator } from "#core/testing.js";

import { dropStaleDefaults } from "./drop-stale-defaults.js";
import type { FieldPath } from "./id.js";
import { internalRegisterFieldPath } from "./internals.js";
import {
  copyForChange,
  type FormMerger,
  type FormValueChange,
} from "./merger.js";
import type { FieldValue, RegisteredPathTrieRef } from "./model.js";
import { StaleDefaultsPass } from "./stale-defaults-pass.js";

function path(...parts: (string | number)[]) {
  return parts as unknown as FieldPath;
}

function change(path: FieldPath, oldValue: FieldValue): FormValueChange {
  return { path, oldValue };
}

function formMerger(merger: Merger, rootSchema: Schema): FormMerger {
  const formMerger: FormMerger = {
    ...merger,
    copyForChange,
    mergeFormDataAndSchemaDefaults({
      schema,
      formData,
      initialDefaultsGenerated = false,
      includeUndefinedValues = false,
    }) {
      return getDefaultFormState(
        createCoreContext({ validator: createValidator(), merger, rootSchema }),
        schema,
        formData,
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

describe("StaleDefaultsPass", () => {
  it("judges an accepted refill by the schema that accepted it on the next iteration", () => {
    const merger = createMerger();
    const rootSchema: Schema = {
      type: "object",
      properties: { x: { type: "string", default: "a" } },
    };
    const droppedSchema: Schema = {
      type: "object",
      properties: { x: { type: "string", default: "b" } },
    };
    const acceptedSchema: Schema = {
      type: "object",
      properties: { x: { type: "string", default: "c" } },
    };
    const rejectingSchema: Schema = {
      type: "object",
      properties: { x: { type: "string", default: "d" } },
    };
    const pathRef: RegisteredPathTrieRef<FieldPath> = {
      current: undefined,
      registered: new WeakSet(),
    };
    const pass = new StaleDefaultsPass({
      validator: createValidator(),
      merger: formMerger(merger, rootSchema),
      rootSchema,
      changes: [change(path("mode"), "a")],
      getChildPath: (parentPath, key) =>
        internalRegisterFieldPath(pathRef, parentPath.concat(key)),
      oldFormData: { x: "a" },
      oldSchema: rootSchema,
    });
    expect(pass.drop({ x: "a" }, droppedSchema, false)).toEqual({});

    // `b`'s default does not match the refill `c`, so the refill is accepted;
    // the schema that accepted it has to be what the next iteration judges.
    expect(pass.afterSanitize({ x: "c" }, { x: "c" }, acceptedSchema)).toEqual({
      x: "c",
    });
    // `c`'s default matches the refill, so moving the key to `d` rejects it.
    // Judged against the drop-time schema `b` instead, the value would stay.
    expect(pass.afterSanitize({ x: "c" }, { x: "c" }, rejectingSchema)).toEqual(
      {}
    );
  });
});
