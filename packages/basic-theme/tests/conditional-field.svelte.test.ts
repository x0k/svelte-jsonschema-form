import { getErrors } from "@sjsf/form";
import { tick } from "svelte";
import { describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { renderFieldForm } from "./helpers.js";

describe("conditional field contracts", () => {
  describe("if/then with boolean false branch", () => {
    test("should block submit when a matched if/then branch resolves to false", async () => {
      const onSubmit = vi.fn();

      const { form } = await renderFieldForm({
        schema: {
          type: "number",
          if: {
            const: 13,
          },
          then: false,
        },
        initialValue: 13,
        onSubmit,
      });

      await userEvent.click(page.getByRole("button", { name: "Submit" }));
      await tick();

      expect(onSubmit).not.toHaveBeenCalled();

      const errors = [...getErrors(form)];
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.flatMap(([, msgs]) => msgs)).toEqual([
        "boolean schema is false",
        'must match "then" schema',
      ]);
    });
  });
});
