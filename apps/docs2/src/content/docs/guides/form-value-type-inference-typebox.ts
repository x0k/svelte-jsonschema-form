import { createForm, type UiSchema } from "@sjsf/form";
import { Type, type Static } from "typebox";

import * as defaults from "@/lib/sjsf/defaults";

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
