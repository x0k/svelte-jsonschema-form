import { form, query } from "$app/server";
import { createServerValidator } from "$lib/rf/server/server.js";

import * as defaults from "../form-defaults.js";
import { schema, uiSchema } from "../model.js";
import { setLastSubmission } from "./submission-store.js";

const initialValue = { firstName: "Jane", lastName: "Doe" };

const validator = createServerValidator<{ firstName: string }>({
  ...defaults,
  schema,
  uiSchema,
});

export const loadInitialData = query(() => {
  return { schema, uiSchema, initialValue };
});

export const createPost = form(validator, (data) => {
  setLastSubmission(data.data);
});
