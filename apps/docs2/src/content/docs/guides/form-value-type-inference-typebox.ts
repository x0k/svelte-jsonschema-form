import { Type, type Static } from "@sinclair/typebox";
import { createForm, type UiSchema } from "@sjsf/form";

import * as defaults from "@/components/form-defaults";

const schema = Type.Object({
  text: Type.String(),
});

const uiSchema: UiSchema = {
  "ui:options": {
    title: "Form title",
  },
  text: {
    "ui:options": {
      title: "Text input",
    },
  },
};

const form = createForm({
  ...defaults,
  schema,
  uiSchema,
  onSubmit: (value: Static<typeof schema>) => {
    console.log(value);
  },
});

// { text: string } | undefined
form.value;
