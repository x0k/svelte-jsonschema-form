import type { FormOptions, Schema, UiSchemaRoot } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../form-defaults.js";
import UiSchemaProxyForm from "./__test__/ui-schema-proxy-ssr.svelte";

const simpleSchema: Schema = {
  title: "Test Form",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
    },
    email: {
      type: "string",
      title: "Email",
    },
  },
};

function ssrForm(formOptions: Partial<FormOptions<any>> & { schema: Schema }) {
  return renderServer(UiSchemaProxyForm, {
    props: {
      ...defaults,
      ...formOptions,
    },
  });
}

describe("uiSchema form options SSR", () => {
  test("renders form with novalidate attribute", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          novalidate: true,
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("novalidate");
  });

  test("renders form with target attribute", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          target: "_blank",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain('target="_blank"');
  });

  test("renders form with enctype attribute", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          enctype: "multipart/form-data",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain('enctype="multipart/form-data"');
  });

  test("renders form with action and method attributes", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          action: "/custom-endpoint",
          method: "POST",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain('action="/custom-endpoint"');
    expect(body).toContain('method="POST"');
  });

  test("renders form with multiple form options combined", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          novalidate: true,
          target: "_blank",
          enctype: "multipart/form-data",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("novalidate");
    expect(body).toContain('target="_blank"');
    expect(body).toContain('enctype="multipart/form-data"');
  });

  test("renders form without form options when uiSchema has none", () => {
    const { body } = ssrForm({
      schema: simpleSchema,
    });
    expect(body).toContain("<form");
    expect(body).not.toContain("novalidate");
    expect(body).not.toContain("target=");
  });

  test("renders form with only some form options", () => {
    const uiSchema: UiSchemaRoot = {
      "ui:options": {
        form: {
          novalidate: true,
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("novalidate");
    expect(body).not.toContain("target=");
    expect(body).not.toContain("enctype=");
  });
});

describe("uiSchema field options SSR", () => {
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

  test("renders field-level description", () => {
    const uiSchema: UiSchemaRoot = {
      name: {
        "ui:options": {
          description: "Enter your full name",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("Enter your full name");
  });

  test("renders field-level title override", () => {
    const uiSchema: UiSchemaRoot = {
      name: {
        "ui:options": {
          title: "Full Name",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("Full Name");
  });

  test("renders multiple field options", () => {
    const uiSchema: UiSchemaRoot = {
      name: {
        "ui:options": {
          description: "Name description",
        },
      },
      email: {
        "ui:options": {
          description: "Email description",
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("Name description");
    expect(body).toContain("Email description");
  });

  test("renders uiSchemaRef that resolves", () => {
    const uiSchema: UiSchemaRoot = {
      $ref: "nameSchema",
      "ui:definitions": {
        nameSchema: {
          "ui:options": {
            description: "Resolved from ref",
          },
        },
      },
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("Resolved from ref");
  });

  test("renders uiSchemaRef that fails to resolve", () => {
    const uiSchema: UiSchemaRoot = {
      $ref: "nonexistent",
    };
    const { body } = ssrForm({
      schema: simpleSchema,
      uiSchema,
    });
    expect(body).toContain("Test Form");
  });
});
