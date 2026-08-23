import type { RequestHandler } from "./$types.js";
import { getLastSubmission } from "./submission-store.js";

export const GET: RequestHandler = () => {
  return Response.json(getLastSubmission());
};
