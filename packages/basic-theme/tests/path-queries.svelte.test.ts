import {
  FIELD_INTERACTED,
  getChildPath,
  getFieldErrors,
  getFieldsErrors,
  getId,
  getPseudoId,
  getSubtreePaths,
  hasFieldState,
  setFieldState,
  updateFieldErrors,
} from "@sjsf/form";
import { describe, expect, test } from "vitest";

import { renderFieldForm } from "./helpers.js";

describe("path queries", () => {
  test("accept plain paths", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
      },
      initialValue: { name: "a", items: ["b"] },
    });

    const namePath = getChildPath(form, [], "name");

    expect(getId(form, ["name"])).toBe(getId(form, namePath));
    expect(getPseudoId(form, ["name"], "errors")).toBe(
      getPseudoId(form, namePath, "errors")
    );
    expect(Array.from(getSubtreePaths(form, ["items"]))).toContainEqual(
      getChildPath(form, ["items"], 0)
    );
  });

  test("getSubtreePaths does not register the queried path", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
      initialValue: { name: "a" },
    });

    expect(Array.from(getSubtreePaths(form, ["missing"]))).toEqual([]);
    expect(Array.from(getSubtreePaths(form, ["missing"]))).toEqual([]);
    expect(Array.from(getSubtreePaths(form, ["missing", "child"]))).toEqual([]);
    expect(Array.from(getSubtreePaths(form, ["missing", "child"]))).toEqual([]);
  });

  test("error and field-state helpers accept plain paths", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
      initialValue: { name: "a" },
    });

    const namePath = getChildPath(form, [], "name");

    updateFieldErrors(form, ["name"], ["bad"]);
    expect(getFieldErrors(form, ["name"])).toEqual(["bad"]);
    expect(getFieldErrors(form, namePath)).toEqual(["bad"]);
    expect(getFieldsErrors(form, [["name"]])).toEqual(["bad"]);

    setFieldState(form, ["name"], FIELD_INTERACTED);
    expect(hasFieldState(form, ["name"], FIELD_INTERACTED)).toBe(true);
    expect(hasFieldState(form, namePath, FIELD_INTERACTED)).toBe(true);
  });
});
