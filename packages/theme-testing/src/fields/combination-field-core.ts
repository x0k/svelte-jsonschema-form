import type { FormOptions, Schema, Theme, UiSchemaRoot } from "@sjsf/form";
import { overrideByRecord } from "@sjsf/form/lib/resolver";

import * as defaults from "../lib/form-defaults.js";
import TestSelectWidget from "./test-select-widget.svelte";

export type CombinationTestFormOptions = Partial<FormOptions<any>> & {
  schema: Schema;
  theme: Theme;
};

export interface CombinationFieldTestOptions {
  context?: Map<any, any>;
  defaultFormOptions?: Partial<FormOptions<any>>;
}

export const discriminatedSchema = {
  type: "object",
  title: "Combination",
  discriminator: {
    propertyName: "kind",
  },
  oneOf: [
    {
      title: "Person option",
      type: "object",
      properties: {
        kind: {
          const: "person",
          title: "Person kind",
          default: "person",
        },
        name: {
          type: "string",
          title: "Name",
          default: "Ada",
        },
        shared: {
          type: "string",
          title: "Shared",
        },
      },
    },
    {
      title: "Company option",
      type: "object",
      properties: {
        kind: {
          const: "company",
          title: "Company kind",
          default: "company",
        },
        companyName: {
          type: "string",
          title: "Company Name",
          default: "Acme",
        },
        shared: {
          type: "string",
          title: "Shared",
        },
      },
    },
  ],
} as const satisfies Schema;

export const discriminatedUiSchema = {
  oneOf: [
    {
      kind: {
        "ui:options": {
          title: "Person from UI",
        },
      },
    },
    {},
  ],
} satisfies UiSchemaRoot;

export const ambiguousSchema = {
  type: "object",
  anyOf: [
    {
      title: "String branch",
      type: "object",
      properties: {
        shared: {
          type: "string",
          title: "Shared",
          default: "string-default",
        },
      },
    },
    {
      title: "Number branch",
      type: "object",
      properties: {
        shared: {
          type: "number",
          title: "Shared",
          default: 7,
        },
      },
    },
  ],
} as const satisfies Schema;

export function withTestSelect(theme: Theme): Theme {
  return overrideByRecord(theme, {
    selectWidget: TestSelectWidget,
  });
}

export function defaultsWith<const O extends Partial<FormOptions<any>>>(
  options: O,
): typeof defaults & O {
  return {
    ...defaults,
    ...options,
  };
}
