import { createForm, type Schema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

import * as defaults from "@/components/form-defaults";

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

const form = createForm({
  ...defaults,
  schema,
  onSubmit: (value: FromSchema<typeof schema>) => {
    console.log(value)
  }
})

// { text: string } | undefined
form.value
