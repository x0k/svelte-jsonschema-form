export function isValidRegExp(pattern: string, flags = "") {
  try {
    new RegExp(pattern, flags);
    return true;
  } catch (e) {
    return false;
  }
}
