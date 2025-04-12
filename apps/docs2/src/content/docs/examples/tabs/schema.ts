import type { Schema } from '@sjsf/form';

export const schema = {
  title: "Multi page form",
  type: "array",
  items: [
    {
      title: "Page 1",
      type: "array",
      items: [
        {
          title: "Page 1.1",
          type: "object",
          properties: {
            label: {
              type: "string",
              title: "Label",
            },
          },
          required: ["label"],
        },
        {
          title: "Page 1.2",
          type: "object",
          properties: {
            otherField: {
              type: "string",
              title: "Other Label",
              minLength: 3,
            },
          },
          required: ["otherField"],
        },
        {
          title: "Page 1.3",
          type: "object",
          properties: {
            number: {
              type: "number",
              title: "Some number",
              minimum: 5,
              maximum: 150,
            },
          },
          required: ["number"],
        },
      ],
    },
    {
      title: "Page 2",
      type: "array",
      items: [
        {
          title: "Page 2.1",
          type: "object",
          properties: {
            label: {
              type: "string",
              title: "Label",
            },
          },
          required: ["label"],
        },
        {
          title: "Page 2.2",
          type: "object",
          properties: {
            otherField: {
              type: "string",
              title: "Other Label",
              minLength: 3,
            },
          },
          required: ["otherField"],
        },
        {
          title: "Page 2.3",
          type: "object",
          properties: {
            number: {
              type: "number",
              title: "Some number",
              minimum: 5,
              maximum: 150,
            },
          },
          required: ["number"],
        },
      ],
    },
  ],
} as const satisfies Schema;
