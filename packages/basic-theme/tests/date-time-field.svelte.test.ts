import "@sjsf/form/fields/extra/date-include";
import "@sjsf/form/fields/extra/unknown-native-date-include";
import type { Schema, UiSchema } from "@sjsf/form";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";

import { expectValue, renderFieldForm } from "./helpers.js";

type Format = "date" | "date-time" | "iso-date-time" | "time" | "iso-time";
type Field = "dateField" | "unknownNativeDateField";

function dateTimeUiSchema(property: string, field: Field): UiSchema {
  return {
    [property]: {
      "ui:components": {
        stringField: field,
      },
    },
  };
}

function dateTimeSchema(property: string, format: Format): Schema {
  return {
    type: "object",
    properties: {
      [property]: { type: "string", title: "Value", format },
    },
  };
}

function lastInput(selector: string) {
  const inputs = document.querySelectorAll<HTMLInputElement>(selector);
  return inputs[inputs.length - 1]!;
}

async function setInputValue(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
}

function localTimeOffset() {
  const offsetMinutes = -new Date().getTimezoneOffset();
  if (offsetMinutes === 0) {
    return "Z";
  }
  const absoluteMinutes = Math.abs(offsetMinutes);
  return `${offsetMinutes > 0 ? "+" : "-"}${String(
    Math.floor(absoluteMinutes / 60)
  ).padStart(2, "0")}:${String(absoluteMinutes % 60).padStart(2, "0")}`;
}

describe("date/time fields", () => {
  test("stores a `date` as a local calendar day", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
    });
    const input = lastInput('input[type="date"]');
    expect(input.value).toBe("");

    await setInputValue(input, "2024-01-02");

    expectValue(form, { value: "2024-01-02" });
  });

  test("displays a stored `date`", async () => {
    await renderFieldForm({
      schema: dateTimeSchema("value", "date"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: "2024-01-02" },
    });
    expect(lastInput('input[type="date"]').value).toBe("2024-01-02");
  });

  test("stores a `date-time` as UTC and displays it as local time", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
    });
    const input = lastInput('input[type="datetime-local"]');
    expect(input.value).toBe("");

    await setInputValue(input, "2024-01-01T12:34");

    expectValue(form, {
      value: new Date(2024, 0, 1, 12, 34).toISOString(),
    });
  });

  test("displays a UTC `date-time` in the local timezone", async () => {
    const local = "2024-01-01T12:34:56";
    await renderFieldForm({
      schema: dateTimeSchema("value", "date-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: new Date(local).toISOString() },
    });
    expect(lastInput('input[type="datetime-local"]').value).toBe(local);
  });

  test("stores a `time` with seconds and the local UTC offset", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
    });
    const input = lastInput('input[type="time"]');
    expect(input.value).toBe("");

    await setInputValue(input, "12:34");

    expectValue(form, { value: `12:34:00${localTimeOffset()}` });
    expect(input.value).toBe("12:34");
  });

  test("strips the `time` offset and zero seconds for display", async () => {
    await renderFieldForm({
      schema: dateTimeSchema("value", "time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: "14:30:00-04:00" },
    });
    expect(lastInput('input[type="time"]').value).toBe("14:30");
  });

  test("strips an `iso-date-time` offset without converting it", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "iso-date-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: "2024-01-01T12:34:56+05:00" },
    });
    const input = lastInput('input[type="datetime-local"]');
    expect(input.value).toBe("2024-01-01T12:34:56");

    await setInputValue(input, "2024-01-01T15:00");

    expectValue(form, { value: "2024-01-01T15:00:00" });
  });

  test("displays a bare `iso-date-time` day as the start of that day", async () => {
    await renderFieldForm({
      schema: dateTimeSchema("value", "iso-date-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: "2024-01-01" },
    });
    expect(lastInput('input[type="datetime-local"]').value).toBe(
      "2024-01-01T00:00"
    );
  });

  test("stores `iso-time` seconds without forcing an offset", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "iso-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
    });
    const input = lastInput('input[type="time"]');

    await setInputValue(input, "12:34");

    expectValue(form, { value: "12:34:00" });
  });

  test("clears the value when a `date-time` input is emptied", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date-time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: new Date(2024, 0, 1, 12, 34).toISOString() },
    });
    const input = lastInput('input[type="datetime-local"]');

    await setInputValue(input, "");

    expectValue(form, {});
  });

  test("clears the value when a `time` input is emptied", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "time"),
      uiSchema: dateTimeUiSchema("value", "dateField"),
      initialValue: { value: "12:34:00Z" },
    });
    const input = lastInput('input[type="time"]');

    await setInputValue(input, "");

    expectValue(form, {});
  });

  test("leaves non-date/time strings to the regular `stringField`", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          value: { type: "string", title: "Value", format: "email" },
        },
      },
    });
    const input = lastInput('input[type="email"]');

    await setInputValue(input, "user@example.com");

    expectValue(form, { value: "user@example.com" });
  });
});

describe("native date/time fields", () => {
  test("picks the date input without a schema format", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          value: { type: "string", title: "Value" },
        },
      },
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
    });
    expect(lastInput('input[type="date"]').value).toBe("");
  });

  test("stores a `date` as a `Date`", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date"),
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
    });
    await setInputValue(lastInput('input[type="date"]'), "2024-01-02");

    expectValue(form, { value: new Date(2024, 0, 2) });
  });

  test("stores a `date-time` as a local `Date`", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date-time"),
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
    });
    await setInputValue(
      lastInput('input[type="datetime-local"]'),
      "2024-01-01T12:34"
    );

    expectValue(form, { value: new Date(2024, 0, 1, 12, 34) });
  });

  test("stores a `time` as a `Date`", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "time"),
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
    });
    await setInputValue(lastInput('input[type="time"]'), "12:34");

    expectValue(form, { value: new Date(1970, 0, 1, 12, 34) });
  });

  test("displays stored `Date` values", async () => {
    await renderFieldForm({
      schema: dateTimeSchema("value", "date"),
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
      initialValue: { value: new Date(2024, 0, 2) },
    });
    expect(lastInput('input[type="date"]').value).toBe("2024-01-02");
  });

  test("clears the value when a native input is emptied", async () => {
    const { form } = await renderFieldForm({
      schema: dateTimeSchema("value", "date-time"),
      uiSchema: dateTimeUiSchema("value", "unknownNativeDateField"),
      initialValue: { value: new Date(2024, 0, 1, 12, 34) },
    });
    await setInputValue(lastInput('input[type="datetime-local"]'), "");

    expectValue(form, {});
  });
});
