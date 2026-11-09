import {
  getValue,
  getValueSnapshot,
  setValue,
  setValueAtPath,
} from "@sjsf/form";
import { describe, expect, test } from "vitest";

import { renderFieldForm } from "./helpers.js";

describe("value queries", () => {
  test("getValue returns the live value without copying it", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          profile: {
            type: "object",
            properties: { name: { type: "string" } },
          },
        },
      },
      initialValue: { profile: { name: "a" } },
    });

    const value = getValue(form) as { profile: { name: string } };
    const profile = value.profile;
    const snapshot = getValueSnapshot(form);

    setValueAtPath(form, ["profile", "name"], "b");

    expect(getValue(form)).toBe(value);
    expect((getValue(form) as typeof value).profile).toBe(profile);
    expect(profile.name).toBe("b");
    expect(snapshot).toEqual({ profile: { name: "a" } });
  });

  test("getValue reflects a replaced root value", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: { name: { type: "string" } },
      },
      initialValue: { name: "a" },
    });

    const value = getValue(form);

    setValue(form, { name: "b" });

    expect(getValue(form)).not.toBe(value);
    expect(getValueSnapshot(form)).toEqual({ name: "b" });
  });
});
