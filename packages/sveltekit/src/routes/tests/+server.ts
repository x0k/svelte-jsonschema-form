import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types.js";
import { getLastSubmission } from "./submission-store.js";

export const GET: RequestHandler = () => {
  return json(getLastSubmission());
};
