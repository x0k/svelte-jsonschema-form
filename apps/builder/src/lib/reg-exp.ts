export function isValidRegExp(pattern: string) {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
}
