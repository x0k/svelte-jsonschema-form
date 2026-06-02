import { jsonSchemaToValibot } from "json-schema-to-valibot";

import { createSchemaTransformer } from "./schema-transform.ts";

export default createSchemaTransformer({
  additionalImports: `import * as v from "valibot"; import { adapt } from "@sjsf/valibot-validator";`,
  createSchemaCode: (schema) =>
    jsonSchemaToValibot(schema as any, {
      module: "none",
    }).slice(15),
});
