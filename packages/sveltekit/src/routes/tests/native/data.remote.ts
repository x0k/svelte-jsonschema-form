import { form, query } from "$app/server";
import { createServerValidator } from "$lib/rf/server/server.js";

import * as defaults from "../../form-defaults.js";
import { schema, uiSchema } from "../../model.js";
import { setLastSubmission } from "../submission-store.js";

export const getInitialData = query(async () => {
  return { schema, uiSchema };
});

export const createPost = form(
  createServerValidator<{ firstName: string }>({
    ...defaults,
    schema,
    uiSchema,
  }),
  (data) => {
    setLastSubmission(data.data);
  }
);
