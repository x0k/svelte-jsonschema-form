import { createAction } from "#lib/server/server.js";

import * as defaults from "../../form-defaults.js";
import { setLastSubmission } from "../submission-store.js";
import type { Actions } from "./$types.js";
import { schema } from "./model.js";

export const actions = {
  default: createAction({ ...defaults, name: "default", schema }, (data) => {
    setLastSubmission(data);
  }),
} satisfies Actions;
