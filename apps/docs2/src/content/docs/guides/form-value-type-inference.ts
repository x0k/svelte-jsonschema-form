import { createForm, type Schema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

import * as defaults from "@/lib/form/defaults";

const schema = {
  type: "object",
  title: "Form title",
  properties: {
    text: {
      type: "string",
      title: "Text input",
    },
  },
  required: ["text"],
  additionalProperties: false
} as const satisfies Schema;

const form = createForm<FromSchema<typeof schema>>({
  ...defaults,
  schema,
})
