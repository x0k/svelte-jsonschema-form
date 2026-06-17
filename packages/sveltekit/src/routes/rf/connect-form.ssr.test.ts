import type { FormOptions, Schema } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../form-defaults.js";
import ConnectForm from "./__test__/ui-schema-proxy-ssr.svelte";

const simpleSchema: Schema = {
  title: "Test Form",
  type: "object",
  required: ["name"],
  properties: {
    name: {
      type: "string",
      title: "Name",
    },
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
  },
};

function ssrForm(formOptions: Partial<FormOptions<any>> & { schema: Schema }) {
  return renderServer(ConnectForm, {
    props: {
      ...defaults,
      ...formOptions,
    },
  });
}

describe("connect form SSR", () => {
  test("renders schema title", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
    });
    expect(body).toContain("Test Form");
  });

  test("renders field titles", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
    });
    expect(body).toContain("Name");
    expect(body).toContain("Email");
  });

  test("renders initial values", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
      initialValue: { name: "John Doe", email: "john@example.com" },
    });
    expect(body).toContain("John Doe");
    expect(body).toContain("john@example.com");
  });

  test("renders initial errors", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
      initialValue: { name: "" },
      initialErrors: [
        {
          path: ["name"],
          message: "Name is required",
        },
      ],
    });
    expect(body).toContain("Name is required");
  });

  test("renders empty form without initial value", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
    });
    expect(body).toContain("Test Form");
    expect(body).toContain("Name");
    expect(body).toContain("Email");
  });

  test("renders required field indicators", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
    });
    expect(body).toContain("required");
  });

  test("renders with custom idPrefix", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
      idPrefix: "custom",
    });
    expect(body).toContain("custom");
  });
});
