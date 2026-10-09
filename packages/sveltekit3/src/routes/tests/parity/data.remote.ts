import { createServerValidator } from "#lib/rf/server/server.js";
import { form, query } from "$app/server";

import * as defaults from "../../form-defaults.js";
import { setLastSubmission } from "../submission-store.js";
import { schema, uiSchema } from "./model.js";

const validator = createServerValidator({
  ...defaults,
  schema,
  uiSchema,
});

export const loadInitialData = query(() => {
  return {
    schema,
    uiSchema,
    initialValue: {
      firstName: "Jane",
      lastName: "Doe",
      // Awkward keys on purpose: `::` is the pseudo-element separator the id
      // builder encodes, and `.` is the path separator.
      "newKey::123": "seed",
      "also.333": "seed",
      // Matches `^tag-`, seeded the same way an additional property is.
      "tag-one": "seed",
    },
  };
});

export const createPost = form(validator, (data) => {
  setLastSubmission(data.data);
});
