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

    test("adds item to empty tuple array with additionalItems", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "array",
          items: [],
          additionalItems: { type: "string" },
        },
      });

      await userEvent.click(page.getByRole("button", { name: /add/i }).first());
      expectValue(form, [""]);
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
