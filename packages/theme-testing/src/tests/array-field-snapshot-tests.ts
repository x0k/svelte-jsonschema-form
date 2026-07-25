// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/aa0a8f842b102fb67e1e6fc7e72bebb79fcab786/packages/snapshot-tests/src/arrayTests.tsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema, Theme, UiSchema, UiSchemaRoot } from "@sjsf/form";
import { resolver } from "@sjsf/form/resolvers/compat";
import { describe, test } from "vitest";

import {
  matchSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./snapshot-helpers.js";

const titleAndDesc = {
  title: "Test field",
  description: "a test description",
};

const itemTitleAndDesc = {
  title: "Test item",
  description: "a test item description",
};

const uiTitleAndDesc = {
  "ui:options": {
    title: "My Field",
    description: "a fancier description",
  },
  items: {
    "ui:options": {
      title: "My Item",
      description: "a fancier item description",
    },
  },
} as const satisfies UiSchema;

const labelsOff = {
  "ui:globalOptions": { hideTitle: true },
} as const satisfies UiSchemaRoot;

export function arrayFieldTests(
  theme: Theme,
  matchOptions?: MatchSnapshotOptions
) {
  const snapshot = (options: Omit<SnapshotFormOptions, "theme">) =>
    matchSnapshot(
      {
        ...options,
        theme,
      },
      {
        ...matchOptions,
        defaultFormOptions: { ...matchOptions?.defaultFormOptions, resolver },
      }
    );

  describe("array fields", () => {
    test("array", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
        },
      };
      await snapshot({ schema });
    });
    test("fixed array", async () => {
      const schema: Schema = {
        type: "array",
        items: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      };
      await snapshot({ schema });
    });
    test("checkboxes", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
          enum: ["a", "b", "c"],
        },
        uniqueItems: true,
      };
      await snapshot({ schema });
    });
    test("array icons", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
        },
      };
      const uiSchema: UiSchema = {
        "ui:options": { copyable: true },
      };
      await snapshot({ schema, uiSchema, initialValue: ["a", "b"] });
    });
    test("empty errors array", async () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      };
      await snapshot({
        schema,
        initialErrors: [
          {
            path: [],
            message: "error",
          },
        ],
      });
    });
  });
  describe("with title and description", () => {
    test("array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
        },
      };
      await snapshot({ schema });
    });
    test("fixed array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: [
          {
            ...itemTitleAndDesc,
            type: "string",
          },
          {
            ...itemTitleAndDesc,
            type: "number",
          },
        ],
      };
      await snapshot({ schema });
    });
    test("checkboxes", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
          enum: ["a", "b", "c"],
        },
        uniqueItems: true,
      };
      await snapshot({ schema });
    });
    test("array icons", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
        },
      };
      const uiSchema: UiSchema = {
        "ui:options": { copyable: true },
      };
      await snapshot({
        schema,
        uiSchema,
        initialValue: ["a", "b"],
      });
    });
  });
  describe("with title and description from uiSchema", () => {
    test("array", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
        },
      };
      await snapshot({ schema, uiSchema: uiTitleAndDesc });
    });
    test("fixed array", async () => {
      const schema: Schema = {
        type: "array",
        items: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      };
      await snapshot({ schema, uiSchema: uiTitleAndDesc });
    });
    test("checkboxes", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
          enum: ["a", "b", "c"],
        },
        uniqueItems: true,
      };
      await snapshot({
        schema,
        uiSchema: uiTitleAndDesc,
      });
    });
    test("array icons", async () => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
        },
      };
      const options = uiTitleAndDesc["ui:options"];
      const uiSchema = {
        ...uiTitleAndDesc,
        "ui:options": {
          ...options,
          copyable: true,
        },
      } satisfies UiSchema;
      await snapshot({ schema, uiSchema, initialValue: ["a", "b"] });
    });
  });
  describe("with title and description from both", () => {
    test("array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          type: "string",
        },
      };
      await snapshot({ schema, uiSchema: uiTitleAndDesc });
    });
    test("fixed array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      };
      await snapshot({ schema, uiSchema: uiTitleAndDesc });
    });
    test("checkboxes", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          type: "string",
          enum: ["a", "b", "c"],
        },
        uniqueItems: true,
      };
      await snapshot({ schema, uiSchema: uiTitleAndDesc });
    });
    test("array icons", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          type: "string",
        },
      };
      const options = uiTitleAndDesc["ui:options"];
      const uiSchema: UiSchema = {
        ...uiTitleAndDesc,
        "ui:options": {
          ...options,
          copyable: true,
        },
      };
      await snapshot({ schema, uiSchema, initialValue: ["a", "b"] });
    });
  });
  describe("with title and description with global label off", () => {
    test("array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
        },
      };
      await snapshot({ schema, uiSchema: labelsOff });
    });
    test("fixed array", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: [
          {
            ...itemTitleAndDesc,
            type: "string",
          },
          {
            ...itemTitleAndDesc,
            type: "number",
          },
        ],
      };
      await snapshot({ schema, uiSchema: labelsOff });
    });
    test("checkboxes", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
          enum: ["a", "b", "c"],
        },
        uniqueItems: true,
      };
      await snapshot({ schema, uiSchema: labelsOff });
    });
    test("array icons", async () => {
      const schema: Schema = {
        type: "array",
        ...titleAndDesc,
        items: {
          ...itemTitleAndDesc,
          type: "string",
        },
      };
      const uiSchema: UiSchema = {
        ...labelsOff,
        "ui:options": { copyable: true },
      };
      await snapshot({ schema, uiSchema, initialValue: ["a", "b"] });
    });
  });
}
