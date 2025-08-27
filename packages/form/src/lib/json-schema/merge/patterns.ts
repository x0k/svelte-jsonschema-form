export function simplePatternsMerger(a: string, b: string): string {
  if (a === b) return a;
  a = a.replace(/^\^|\$$/g, "");
  b = b.replace(/^\^|\$$/g, "");
  return `^(?=.*${a})(?=.*${b}).*$`;
}

export function legacyPatternsMerger(a: string, b: string): string {
  return a === b ? a : `(?=${a})(?=${b})`;
}
