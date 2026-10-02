import { describe, expect, it } from "vitest";

import { createUiSchemaWithFormAttributes } from "./ui-schema.ts";

function mockRemoteForm() {
  return {
    action: "/submit",
    method: "POST",
  } as any;
}

describe("createUiSchemaWithFormAttributes", () => {
  describe("undefined schema", () => {
    it("returns an object with ui:options containing form with action and method", () => {
      const remoteForm = mockRemoteForm();
      const result: any = createUiSchemaWithFormAttributes(
        remoteForm,
        undefined,
        undefined
      );
      expect(typeof result).toBe("object");
      expect("ui:options" in result).toBe(true);
      expect(Object.keys(result)).toContain("ui:options");
      expect({ ...result }["ui:options"]).toBeDefined();
      expect("form" in result["ui:options"]).toBe(true);
      expect(result["ui:options"]["form"].action).toBe("/submit");
      expect(result["ui:options"]["form"].method).toBe("POST");
    });
  });

  describe("defined schema", () => {
    const schema = {
      name: {
        "ui:options": {
          title: "Name",
        },
      },
    } as any;

    it("exposes schema keys via ownKeys, Object.keys, in, and spread", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect(Reflect.ownKeys(proxy)).toContain("name");
      expect(Object.keys(proxy)).toContain("name");
      expect("name" in proxy).toBe(true);
      expect({ ...proxy }.name).toBeDefined();
    });

    it("always reports ui:options as present via in", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect("ui:options" in proxy).toBe(true);
    });

    it("ui:options is enumerable on the outer proxy (ownKeys matches has trap)", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect("ui:options" in proxy).toBe(true);
      expect(Object.keys(proxy)).toContain("ui:options");
      expect({ ...proxy }["ui:options"]).toBeDefined();
    });

    it("accesses nested property values through the proxy", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect(proxy.name["ui:options"].title).toBe("Name");
    });

    it("ui:options sub-proxy has form", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect("form" in proxy["ui:options"]).toBe(true);
    });

    it("form is enumerable on the ui:options proxy (ownKeys matches has trap)", () => {
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      const uiOptions = proxy["ui:options"];
      expect("form" in uiOptions).toBe(true);
      expect(Object.keys(uiOptions)).toContain("form");
      expect({ ...uiOptions }["form"]).toBeDefined();
    });

    it("form sub-proxy exposes action and method via ownKeys and spread", () => {
      const remoteForm = mockRemoteForm();
      const proxy: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schema,
        undefined
      );
      const form = proxy["ui:options"]["form"];
      expect(Object.keys(form)).toEqual(
        expect.arrayContaining(["action", "method"])
      );
      expect({ ...form }).toEqual(
        expect.objectContaining({ action: "/submit", method: "POST" })
      );
    });
  });

  describe("schema with existing ui:options", () => {
    it("preserves existing properties and adds form with action and method", () => {
      const schema = { "ui:options": { title: "My Title" } } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect(proxy["ui:options"].title).toBe("My Title");
      expect("form" in proxy["ui:options"]).toBe(true);
      expect(proxy["ui:options"]["form"].action).toBe("/submit");
      expect(proxy["ui:options"]["form"].method).toBe("POST");
    });
  });

  describe("$ref resolution", () => {
    it("resolves top-level $ref to referenced definition", () => {
      const schema = {
        $ref: "myRef",
        "ui:definitions": {
          myRef: { name: { "ui:options": { title: "From Ref" } } },
        },
      } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect(proxy.name["ui:options"].title).toBe("From Ref");
    });

    it("does not resolve field-level $ref or schema without $ref", () => {
      const schemaWithFieldRef = {
        name: { $ref: "nameRef" },
        "ui:definitions": {
          nameRef: { "ui:options": { title: "Resolved Name" } },
        },
      } as any;
      const schemaWithoutRef = {
        name: { "ui:options": { title: "Direct" } },
      } as any;
      const remoteForm = mockRemoteForm();
      const proxyWithRef: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schemaWithFieldRef,
        undefined
      );
      const proxyWithoutRef: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schemaWithoutRef,
        undefined
      );
      expect(proxyWithRef.name.$ref).toBe("nameRef");
      expect(proxyWithoutRef.name["ui:options"].title).toBe("Direct");
      expect(proxyWithRef["ui:options"]["form"].action).toBe("/submit");
      expect(proxyWithoutRef["ui:options"]["form"].method).toBe("POST");
    });

    it("falls through to undefined schema path for unresolvable top-level $ref", () => {
      const schema = { $ref: "nonexistent" } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        mockRemoteForm(),
        schema,
        undefined
      );
      expect("ui:options" in proxy).toBe(true);
      expect(proxy.$ref).toBeUndefined();
      expect(proxy["ui:options"]["form"].action).toBe("/submit");
      expect(proxy["ui:options"]["form"].method).toBe("POST");
    });
  });

  describe("uiOptionsRegistry", () => {
    it("resolves registry: form option, merges with remoteForm overrides and spread", () => {
      const remoteForm = mockRemoteForm();
      const registry = { myAction: { novalidate: true } };
      const schema = {
        "ui:options": { form: "registry:myAction" as any },
      } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schema,
        registry
      );
      const form = proxy["ui:options"]["form"];
      expect(form.novalidate).toBe(true);
      expect(form.action).toBe("/submit");
      expect(form.method).toBe("POST");
      expect({ ...form }).toEqual(
        expect.objectContaining({
          novalidate: true,
          action: "/submit",
          method: "POST",
        })
      );
    });

    it("passes non-registry form option through unchanged", () => {
      const remoteForm = mockRemoteForm();
      const schema = {
        "ui:options": { form: { novalidate: true, target: "_blank" } },
      } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schema,
        undefined
      );
      const form = proxy["ui:options"]["form"];
      expect(form.novalidate).toBe(true);
      expect(form.target).toBe("_blank");
      expect(form.action).toBe("/submit");
      expect(form.method).toBe("POST");
    });

    it("overrides predefined action and method with remoteForm values", () => {
      const remoteForm = mockRemoteForm();
      const schema = {
        "ui:options": {
          form: { action: "/ignored", method: "GET", novalidate: true },
        },
      } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schema,
        undefined
      );
      const form = proxy["ui:options"]["form"];
      expect(form.action).toBe("/submit");
      expect(form.method).toBe("POST");
      expect(form.novalidate).toBe(true);
    });

    it("passes non-form registry values through unchanged", () => {
      const remoteForm = mockRemoteForm();
      const schema = { "ui:options": { title: "My Title" } } as any;
      const proxy: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schema,
        {}
      );
      expect(proxy["ui:options"].title).toBe("My Title");
      expect(proxy["ui:options"]["form"].action).toBe("/submit");
      expect(proxy["ui:options"]["form"].method).toBe("POST");
    });

    it("resolves different registry keys and falls back for missing keys", () => {
      const registry = { formConfig: { enctype: "multipart/form-data" } };
      const schemaPresent = {
        "ui:options": { form: "registry:formConfig" as any },
      } as any;
      const schemaMissing = {
        "ui:options": { form: "registry:missing" as any },
      } as any;
      const remoteForm = mockRemoteForm();
      const proxyPresent: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schemaPresent,
        registry
      );
      const proxyMissing: any = createUiSchemaWithFormAttributes(
        remoteForm,
        schemaMissing,
        undefined
      );
      expect(proxyPresent["ui:options"]["form"].enctype).toBe(
        "multipart/form-data"
      );
      expect(proxyPresent["ui:options"]["form"].action).toBe("/submit");
      expect(proxyPresent["ui:options"]["form"].method).toBe("POST");
      expect(proxyMissing["ui:options"]["form"].action).toBe("/submit");
      expect(proxyMissing["ui:options"]["form"].method).toBe("POST");
    });
  });
});
