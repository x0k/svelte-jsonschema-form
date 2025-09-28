import { Type, type Static } from "typebox";
import { createForm, type UiSchema } from "@sjsf/form";

import * as defaults from "@/lib/form/defaults";

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

const form = createForm<Static<typeof schema>>({
  ...defaults,
  schema,
  uiSchema,
});

// { text: string } | undefined
form.value;
