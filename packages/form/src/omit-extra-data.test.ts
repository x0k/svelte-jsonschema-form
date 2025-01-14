// This file contains content from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/core/test/Form.test.jsx
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { describe, expect, it, beforeEach } from "vitest";

import type { Validator } from "./core/validator.js";
import type { Schema } from "./core/schema.js";
import { makeTestValidator } from "./core/test-validator.js";
import { defaultMerger } from "./core/merger.js";

import { omitExtraData } from "./omit-extra-data.js";

let validator: Validator;

beforeEach(() => {
  validator = makeTestValidator();
});

describe("omitExtraData", () => {
  it("Should omit extra data", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
      },
    };
    const formData = { foo: "bar", baz: "baz" };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).eql({
      foo: "bar",
    });
  });

  it("should omit extra data 2", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" },
      },
    };
    const formData = { foo: "foo", baz: "baz" };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      foo: "foo",
    });
  });

  it("should not omit additionalProperties", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" },
        add: {
          type: "object",
          additionalProperties: {},
        },
      },
    };
    const formData = { foo: "foo", baz: "baz", add: { prop: 123 } };
    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      foo: "foo",
      add: { prop: 123 },
    });
  });

  it("should rename formData key if key input is renamed in a nested object", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        nested: {
          additionalProperties: { type: "string" },
        },
      },
    };
    const formData = { nested: { key1: "value" } };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      nested: { key1: "value" },
    });
  });

  it("should allow oneOf data entry", () => {
    const schema: Schema = {
      type: "object",
      oneOf: [
        {
          properties: {
            lorem: {
              type: "string",
            },
          },
          required: ["lorem"],
        },
        {
          properties: {
            ipsum: {
              type: "string",
            },
          },
          required: ["ipsum"],
        },
      ],
    };
    const formData = { lorum: "", lorem: "foo" };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      lorem: "foo",
    });
  });

  it("should allow anyOf data entry", () => {
    const schema: Schema = {
      type: "object",
      anyOf: [
        {
          properties: {
            lorem: {
              type: "string",
            },
          },
          required: ["lorem"],
        },
        {
          properties: {
            ipsum: {
              type: "string",
            },
          },
          required: ["ipsum"],
        },
      ],
    };
    const formData = { ipsum: "" };

    expect(omitExtraData(validator, defaultMerger, schema, formData)).toEqual({
      ipsum: "",
    });
  });
});
