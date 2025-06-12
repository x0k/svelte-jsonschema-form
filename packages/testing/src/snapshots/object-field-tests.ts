// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/aa0a8f842b102fb67e1e6fc7e72bebb79fcab786/packages/snapshot-tests/src/objectTests.tsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, test } from "vitest";
import {
  pathToId,
  type Schema,
  type Theme,
  type UiSchema,
  type UiSchemaRoot,
} from "@sjsf/form";
import { resolver } from "@sjsf/form/resolvers/compat";

import {
  matchSnapshot,
  type MatchSnapshotOptions,
  type SnapshotFormOptions,
} from "./core";

import * as oneOfDefaults from "./test-data/one-of-defaults";

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
  const snapshot = (
    options: Omit<SnapshotFormOptions, "theme">,
    state = "normal"
  ) =>
    matchSnapshot(
      state,
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
    test("object", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: { type: "string", title: "A" },
          b: { type: "number", title: "B" },
        },
      };
      snapshot({ schema });
    });
    test("has errors", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      };
      snapshot({
        schema,
        initialErrors: [
          {
            error: null as any,
            instanceId: pathToId([]),
            propertyTitle: "title",
            message: "error",
          },
        ],
      });
    });
    test("additionalProperties", () => {
      const schema: Schema = {
        type: "object",
        additionalProperties: true,
      };
      snapshot({
        schema,
        initialValue: { foo: "foo" },
      });
    });
    test("show add button and fields if additionalProperties is true and not an object", () => {
      const schema: Schema = {
        additionalProperties: true,
      };
      const formData: any = {
        additionalProperty: "should appear",
      };
      snapshot({ schema, initialValue: formData });
    });
    describe("with title and description", () => {
      test("object", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        snapshot({ schema });
      });
      test("additionalProperties", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        snapshot({ schema, initialValue: { foo: "foo" } });
      });
      test("show add button and fields if additionalProperties is true and not an object", () => {
        const schema: Schema = {
          ...titleAndDesc,
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        snapshot({ schema, initialValue: formData });
      });
    });
    describe("with title and description from uiSchema", () => {
      test("object", () => {
        const schema: Schema = {
          type: "object",
          properties: {
            a: { type: "string", title: "A" },
            b: { type: "number", title: "B" },
          },
        };
        snapshot({ schema, uiSchema: uiTitleAndDesc });
      });
      test("additionalProperties", () => {
        const schema: Schema = {
          type: "object",
          additionalProperties: true,
        };
        snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: { foo: "foo" },
        });
      });
      test("show add button and fields if additionalProperties is true and not an object", () => {
        const schema: Schema = {
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: formData,
        });
      });
    });
    describe("with title and description from both", () => {
      test("object", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        snapshot({ schema, uiSchema: uiTitleAndDesc });
      });
      test("additionalProperties", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        snapshot({
          schema,
          uiSchema: uiTitleAndDesc,
          initialValue: { foo: "foo" },
        });
      });
    });
    describe("with title and description with global label off", () => {
      test("object", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          properties: {
            a: { type: "string", title: "A", description: "A description" },
            b: { type: "number", title: "B", description: "B description" },
          },
        };
        snapshot({ schema, uiSchema: labelsOff });
      });
      test("additionalProperties", () => {
        const schema: Schema = {
          type: "object",
          ...titleAndDesc,
          additionalProperties: true,
        };
        snapshot({
          schema,
          uiSchema: labelsOff,
          initialValue: { foo: "foo" },
        });
      });
      test("show add button and fields if additionalProperties is true and not an object", () => {
        const schema: Schema = {
          ...titleAndDesc,
          additionalProperties: true,
        };
        const formData: any = {
          additionalProperty: "should appear",
        };
        snapshot({
          schema,
          uiSchema: labelsOff,
          initialValue: formData,
        });
      });
    });
    describe("defaults", () => {
      test("oneOfDefaults", () => {
        snapshot(
          {
            schema: oneOfDefaults.schema,
            uiSchema: oneOfDefaults.uiSchema,
            initialValue: oneOfDefaults.initialValue,
          },
          "normal"
        );
        snapshot(
          {
            schema: oneOfDefaults.schema,
            uiSchema: oneOfDefaults.uiSchema,
            initialValue: {
              ...oneOfDefaults.initialValue,
              preset: oneOfDefaults.TransformPreset.Manual,
            },
          },
          "manual-preset"
        );
      });
    });
  });
}
