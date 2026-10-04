// Playwright runs the test routes concurrently, so a single slot would let one
// test's submission overwrite another's before it is read back. Keep every
// submission and let the reader pick the one it means.
//
// Keyed by submitted name rather than by route: every route shares one
// `data.remote.ts`, so the request URL inside the remote function is the same
// for all of them and identifies nothing useful.
const submissions: unknown[] = [];

export function setLastSubmission(data: unknown) {
  submissions.push(data);
}

/**
 * The most recent submission whose `firstName` is `firstName`, or the most
 * recent one when that is omitted. Returns `null` when nothing matches, so a
 * test cannot pass on a stale submission from another test.
 */
export function getSubmission(firstName?: string | null) {
  if (firstName === null || firstName === undefined) {
    return submissions[submissions.length - 1];
  }
  for (let i = submissions.length - 1; i >= 0; i--) {
    const submission = submissions[i];
    if (
      typeof submission === "object" &&
      submission !== null &&
      "firstName" in submission &&
      submission.firstName === firstName
    ) {
      return submission;
    }
  }
  return null;
}
