import { jsonSchemaToZod } from "json-schema-to-zod";

import { createSchemaTransformer } from "./schema-transform.ts";

export default createSchemaTransformer({
  additionalImports: `import * as z from "zod"; import { adapt } from "@sjsf/zod4-validator/classic";`,
  createSchemaCode: (schema) =>
    jsonSchemaToZod(schema, {
      noImport: true,
    }),
});
