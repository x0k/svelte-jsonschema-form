import type { RequestHandler } from "./$types.js";
import { getSubmission } from "./submission-store.js";

export const GET: RequestHandler = ({ url }) => {
  // Playwright runs the test routes concurrently against one store, so the
  // reader says which submission it means by the name it submitted under.
  return Response.json(getSubmission(url.searchParams.get("firstName")));
};
