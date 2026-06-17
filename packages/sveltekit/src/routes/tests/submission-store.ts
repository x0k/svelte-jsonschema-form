let lastSubmission: unknown = null;

export function setLastSubmission(data: unknown) {
  lastSubmission = data;
}

export function getLastSubmission() {
  return lastSubmission;
}
