import {
  getChildPath,
  insertArrayItem,
  moveArrayItem,
  removeArrayItem,
  reset,
  setValue,
  setValueAtPath,
  swapArrayItems,
  updateValueAtPath,
} from "@sjsf/form";
import type { SchemaObjectValue } from "@sjsf/form/core";
import { describe, test } from "vitest";

import { expectValue, renderFieldForm } from "./helpers.js";

describe("value commands", () => {
  test("setValue replaces the whole value and merges property defaults", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          name: { type: "string", default: "anon" },
          age: { type: "number" },
        },
      },
      initialValue: {},
    });

    setValue(form, { age: 42 });

    expectValue(form, { name: "anon", age: 42 });
  });

  test("setValueAtPath accepts a plain path", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "string" } },
        },
      },
      initialValue: { items: ["a", "b"] },
    });

    setValueAtPath(form, ["items", 0], "c");

    expectValue(form, { items: ["c", "b"] });
  });

  test("setValueAtPath accepts a registered FieldPath", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "string" } },
        },
      },
      initialValue: { items: ["a", "b"] },
    });

    const path = getChildPath(form, ["items"], 0);
    setValueAtPath(form, path, "c");

    expectValue(form, { items: ["c", "b"] });
  });

  test("setValueAtPath replaces the root value", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: { name: { type: "string" } },
      },
      initialValue: { name: "a" },
    });

    setValueAtPath(form, [], { name: "b" });

    expectValue(form, { name: "b" });
  });

  test("updateValueAtPath mutates an object in place", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          cfg: {
            type: "object",
            properties: { name: { type: "string" } },
          },
        },
      },
      initialValue: { cfg: { name: "a" } },
    });

    updateValueAtPath(form, ["cfg"], (cfg: SchemaObjectValue) => {
      cfg.name = "b";
      return cfg;
    });

    expectValue(form, { cfg: { name: "b" } });
  });

  test("reset restores initialValue", async () => {
    const { form } = await renderFieldForm({
      schema: { type: "array", items: { type: "string" } },
      initialValue: ["a"],
    });

    setValue(form, ["b"]);
    reset(form);

    expectValue(form, ["a"]);
  });

  test("array commands ignore non-integer indices", async () => {
    const { form } = await renderFieldForm({
      schema: { type: "array", items: { type: "string" } },
      initialValue: ["a", "b", "c"],
    });

    insertArrayItem(form, [], "x", 1.5);
    insertArrayItem(form, [], "x", NaN);
    removeArrayItem(form, [], 1.5);
    removeArrayItem(form, [], Infinity);
    moveArrayItem(form, [], 1.5, 2);
    moveArrayItem(form, [], 0, NaN);
    swapArrayItems(form, [], 1.5, 2);
    swapArrayItems(form, [], -1, 0);

    expectValue(form, ["a", "b", "c"]);
  });

  test("array commands ignore out-of-bounds indices", async () => {
    const { form } = await renderFieldForm({
      schema: { type: "array", items: { type: "string" } },
      initialValue: ["a", "b", "c"],
    });

    insertArrayItem(form, [], "x", 4);
    removeArrayItem(form, [], 3);
    moveArrayItem(form, [], 0, 3);
    swapArrayItems(form, [], 0, 3);

    expectValue(form, ["a", "b", "c"]);
  });
});
