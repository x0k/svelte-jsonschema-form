// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/aa0a8f842b102fb67e1e6fc7e72bebb79fcab786/packages/snapshot-tests/src/objectTests.tsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  encodePseudoElement,
  type Schema,
  type Theme,
  type UiSchema,
  type UiSchemaRoot,
} from "@sjsf/form";
import { resolver } from "@sjsf/form/resolvers/compat";
import { describe, test } from "vitest";

import {
  matchSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./snapshot-helpers.js";
import * as oneOfDefaults from "./test-data/one-of-defaults.js";

const titleAndDesc = {
  title: "Test field",
  description: "a test description",
};

const uiTitleAndDesc: UiSchema = {
  "ui:options": {
    title: "My Field",
    description: "a fancier description",
  },
  a: {
    "ui:options": {
      title: "My Item A",
      description: "a fancier item A description",
    },
  },
  b: {
    "ui:options": {
      title: "My Item B",
      description: "a fancier item B description",
    },
  },
};

const labelsOff: UiSchemaRoot = {
  "ui:globalOptions": { hideTitle: true },
};

export function objectTests(theme: Theme, matchOptions?: MatchSnapshotOptions) {
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

  describe("object fields", () => {
    test("object", async () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: { type: "string", title: "A" },
          b: { type: "number", title: "B" },
        },
      };
      await snapshot({ schema });
    });
    test("has errors", async () => {
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
    test("additionalProperties", async () => {
      const schema: Schema = {
        type: "object",
        additionalProperties: true,
      };
      await snapshot({
        schema,
        initialValue: { foo: "foo" },
      });
    });
    test("additionalProperties with error", async () => {
      const schema: Schema = {
        type: "object",
        additionalProperties: true,
      };
      await snapshot({
        schema,
        initialValue: { foo: "foo" },
        initialErrors: [
          {
            path: ["foo", encodePseudoElement("key-input")],
            message: "error",
          },
        ],
      });
    });
    test("show add button and fields if additionalProperties is true and not an object", async () => {
      const schema: Schema = {
        additionalProperties: true,
      };
      const formData: any = {
        additionalProperty: "should appear",
      };
      await snapshot({ schema, initialValue: formData });
    });
    describe("with title and description", () => {
      test("object", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        await snapshot({ schema });
      });
      test("additionalProperties", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        await snapshot({ schema, initialValue: { foo: "foo" } });
      });
      test("show add button and fields if additionalProperties is true and not an object", async () => {
        const schema: Schema = {
          ...titleAndDesc,
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        await snapshot({ schema, initialValue: formData });
      });
    });
    describe("with title and description from uiSchema", () => {
      test("object", async () => {
        const schema: Schema = {
          type: "object",
          properties: {
            a: { type: "string", title: "A" },
            b: { type: "number", title: "B" },
          },
        };
        await snapshot({ schema, uiSchema: uiTitleAndDesc });
      });
      test("additionalProperties", async () => {
        const schema: Schema = {
          type: "object",
          additionalProperties: true,
        };
        await snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: { foo: "foo" },
        });
      });
      test("show add button and fields if additionalProperties is true and not an object", async () => {
        const schema: Schema = {
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        await snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: formData,
        });
      });
    });
    describe("with title and description from both", () => {
      test("object", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        await snapshot({ schema, uiSchema: uiTitleAndDesc });
      });
      test("additionalProperties", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        await snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: { foo: "foo" },
        });
      });
    });
    describe("with title and description with global label off", () => {
      test("object", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        await snapshot({ schema, uiSchema: labelsOff });
      });
      test("additionalProperties", async () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        await snapshot({
          schema,
          uiSchema: labelsOff,
          initialValue: { foo: "foo" },
        });
      });
      test("show add button and fields if additionalProperties is true and not an object", async () => {
        const schema: Schema = {
          ...titleAndDesc,
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        await snapshot({
          schema,
          uiSchema: labelsOff,
          initialValue: formData,
        });
      });
    });
    describe("one of defaults", () => {
      test("default preset", async () => {
        await snapshot({
          schema: oneOfDefaults.schema,
          uiSchema: oneOfDefaults.uiSchema,
          initialValue: oneOfDefaults.initialValue,
        });
      });

      test("manual preset", async () => {
        await snapshot({
          schema: oneOfDefaults.schema,
          uiSchema: oneOfDefaults.uiSchema,
          initialValue: {
            ...oneOfDefaults.initialValue,
            preset: oneOfDefaults.TransformPreset.Manual,
          },
        });
      });
    });
  });
}
