import {
  insertArrayItem,
  moveArrayItem,
  removeArrayItem,
  swapArrayItems,
  type KeyedArraysMap,
} from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

describe("array field contracts", () => {
  describe("add items", () => {
    test("adds item to array", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["a"],
      });

      await userEvent.click(page.getByRole("button", { name: /add/i }).first());
      expectValue(form, ["a", ""]);
    });

    test("adds item to empty array", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: [],
      });

      await userEvent.click(page.getByRole("button", { name: /add/i }).first());
      expectValue(form, [""]);
    });

    test("adds item to tuple array with additionalItems", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "array",
          items: [{ type: "number" }],
          additionalItems: { type: "string" },
        },
        initialValue: [42],
      });

      await userEvent.click(page.getByRole("button", { name: /add/i }).first());
      expectValue(form, [42, ""]);
    });

    test("adds multiple items preserves order", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: [],
      });

      const add = page.getByRole("button", { name: /add/i }).first();
      await userEvent.click(add);
      await userEvent.click(add);
      await userEvent.click(add);

      await userEvent.fill(page.getByRole("textbox").nth(0), "first");
      await userEvent.fill(page.getByRole("textbox").nth(1), "second");
      await userEvent.fill(page.getByRole("textbox").nth(2), "third");

      expectValue(form, ["first", "second", "third"]);
    });

    test("mutates a nested array through the dedicated array commands", async () => {
      let value = $state({ items: ["a", "b"] });
      const keyedArraysMap: KeyedArraysMap = new WeakMap();
      const { form } = await renderFieldForm({
        schema: {
          type: "object",
          properties: { items: { type: "array", items: { type: "string" } } },
        },
        value: [() => value, (v) => (value = v)],
        keyedArraysMap,
      });

      const path = ["items"] as any;
      const keyed = () => keyedArraysMap.get(value.items)!;
      const firstKey = keyed().key(0);

      insertArrayItem(form, path, "c");
      expectValue(form, { items: ["a", "b", "c"] });
      expect(keyed().key(0)).toBe(firstKey);

      moveArrayItem(form, path, 0, 2);
      expectValue(form, { items: ["b", "c", "a"] });
      expect(keyed().key(2)).toBe(firstKey);

      swapArrayItems(form, path, 0, 1);
      expectValue(form, { items: ["c", "b", "a"] });
      expect(keyed().key(2)).toBe(firstKey);

      removeArrayItem(form, path, 1);
      expectValue(form, { items: ["c", "a"] });
    });
  });

  describe("remove items", () => {
    test("removes item from middle", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["a", "b", "c"],
      });

      await userEvent.click(page.getByRole("button", { name: /del/i }).nth(1));
      expectValue(form, ["a", "c"]);
    });

    test("removes first item", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["a", "b", "c"],
      });

      await userEvent.click(page.getByRole("button", { name: /del/i }).first());
      expectValue(form, ["b", "c"]);
    });

    test("removes last item", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["a", "b", "c"],
      });

      await userEvent.click(page.getByRole("button", { name: /del/i }).last());
      expectValue(form, ["a", "b"]);
    });

    test("removes only item results in empty array", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["only"],
      });

      await userEvent.click(page.getByRole("button", { name: /del/i }).first());
      expectValue(form, []);
    });
  });

  describe("fixed-length tuples", () => {
    test("renders correct number of inputs and initial values", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "array",
          items: [{ type: "string" }, { type: "number" }],
        },
        initialValue: ["first", 100],
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toHaveValue("first");
      await expect
        .element(page.getByRole("spinbutton").first())
        .toHaveValue(100);
      expectValue(form, ["first", 100]);
    });
  });
});
