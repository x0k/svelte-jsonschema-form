const n=`import type { Schema } from "@sjsf/form";

const schemas: Record<string, Schema> = {
  foo: {
    type: "object",
    properties: {
      foo: {
        type: "string",
        minLength: 8
      },
    },
    required: ["foo"],
  },
  bar: {
    type: "object",
    properties: {
      bar: {
        type: "number",
        minimum: 12345
      },
    },
    required: ["bar"],
  },
};

export async function loadSchemaById(id: string): Promise<Schema | undefined> {
  return schemas[id];
}

const results: unknown[] = [];

export async function saveResult(data: unknown) {
  results.push(data);
}

export async function loadResults() {
  return results;
}
`;export{n as s};
