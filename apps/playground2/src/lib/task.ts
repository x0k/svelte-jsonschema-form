export function checkSignal(s: AbortSignal) {
  if (s.aborted) {
    throw new Error(s.reason);
  }
}
