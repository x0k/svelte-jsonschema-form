import { setValue } from "@sjsf/form";
import { tick } from "svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { renderFieldForm, expectValue } from "./helpers.js";

async function rename(oldKey: string, newKey: string) {
  const input = document.getElementById(
    `root_${oldKey}__key-input`
  ) as HTMLInputElement | null;
  if (!input) {
    throw new Error(`missing key input for ${oldKey}`);
  }
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, newKey);
  await userEvent.tab();
}

function element(id: string) {
  return document.getElementById(`root_${id}`);
}

function remove(id: string) {
  const row = element(id)?.closest('[data-layout="object-property"]');
  const button = row?.querySelector("button");
  if (!button) {
    throw new Error(`missing remove button for ${id}`);
  }
  button.click();
  return tick();
}

describe("renaming an additional property key", () => {
  test("keeps every renamed property's field instance", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { start: "one", other: "two" },
    });
    const first = element("start");

    await rename("start", "renamed");
    await rename("other", "other2");

    expect(element("renamed")).toBe(first);
  });

  test("does not reuse a property instance after the value was replaced from outside", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { a: "one" },
    });
    await rename("a", "b");

    setValue(form, { x: "one" });
    await tick();
    setValue(form, { a: "one" });
    await tick();
    const a = element("a");

    setValue(form, { a: "one", b: "two" });
    await tick();

    expect(element("a")).toBe(a);
    expect(element("b")).not.toBe(a);
  });

  test("keeps each field instance when properties swap names", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { a: "one", b: "two" },
    });
    const one = element("a");
    const two = element("b");

    await rename("a", "temporary");
    await rename("b", "a");
    await rename("temporary", "b");

    expect(element("b")).toBe(one);
    expect(element("a")).toBe(two);
    expect((element("b") as HTMLInputElement).value).toBe("one");
    expect((element("a") as HTMLInputElement).value).toBe("two");
    expectValue(form, { a: "two", b: "one" });
  });

  test("keeps field instances when properties keep taking a freed name", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { a: "one", b: "two", c: "three" },
    });
    const one = element("a");
    const two = element("b");
    const three = element("c");

    await rename("a", "first");
    await rename("b", "a");
    await rename("a", "second");
    await rename("c", "a");

    expect(element("first")).toBe(one);
    expect(element("second")).toBe(two);
    expect(element("a")).toBe(three);
  });

  test("labels a key renamed onto a declared property by that property's title", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        properties: { end: { type: "string", title: "End date" } },
        additionalProperties: { type: "string" },
      },
      initialValue: { start: "one", other: "two" },
    });

    await rename("start", "end");
    expect(
      document.querySelector('label[for="root_end"]')?.textContent?.trim()
    ).toBe("End date");

    await rename("other", "other2");
    expect(
      document.querySelector('label[for="root_end"]')?.textContent?.trim()
    ).toBe("End date");
  });

  test("keeps focus on a key renamed onto a declared property", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        properties: { end: { type: "string", title: "End date" } },
        additionalProperties: { type: "string" },
      },
      initialValue: { start: "one" },
    });

    await rename("start", "end");

    expect(document.activeElement?.id).toBe("root_end");
  });

  test("keeps focus when a rename turns the value into a declared object", async () => {
    const declared = {
      type: "object",
      properties: { inner: { type: "string" } },
    } as const;
    await renderFieldForm({
      schema: {
        type: "object",
        properties: { end: declared },
        additionalProperties: declared,
      },
      initialValue: { start: { inner: "one" } },
    });

    await rename("start", "end");

    expect(document.activeElement?.id).toBe("root_end_inner");
  });

  test("keeps focus when a rename turns the value into a declared enum", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        properties: {
          end: { type: "string", title: "End date", enum: ["one", "two"] },
        },
        additionalProperties: { type: "string" },
      },
      initialValue: { start: "one" },
    });

    await rename("start", "end");

    expect(document.activeElement?.id).toBe("root_end");
  });

  test("keeps a property holding a variant of the key a removed property held", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { "Additional property": "one" },
    });
    await rename("Additional property", "first");
    await userEvent.click(
      page.getByRole("button", { name: /add property/i }).first()
    );
    await rename("Additional property", "second");
    await userEvent.click(
      page.getByRole("button", { name: /add property/i }).first()
    );
    const added = element("Additional property");

    await remove("second");

    expect(element("second")).toBeNull();
    expect(element("Additional property")).toBe(added);
  });

  test("keeps a property when a rename takes the name of a removed one", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { "Additional property": "one" },
    });
    await rename("Additional property", "renamed");
    await userEvent.click(
      page.getByRole("button", { name: /add property/i }).first()
    );
    const added = element("Additional property");
    await remove("renamed");
    await userEvent.click(
      page.getByRole("button", { name: /add property/i }).first()
    );

    await rename("Additional property-1", "renamed");

    expect(element("Additional property")).toBe(added);
  });

  test("keeps a property added under a name a removed renamed property held", async () => {
    await renderFieldForm({
      schema: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      initialValue: { "Additional property": "one" },
    });
    await rename("Additional property", "renamed");
    const renamed = element("renamed");

    await userEvent.click(
      page.getByRole("button", { name: /add property/i }).first()
    );
    const added = element("Additional property");
    expect(added).not.toBe(renamed);

    await remove("renamed");

    expect(element("renamed")).toBeNull();
    expect(element("Additional property")).toBe(added);
  });
});
