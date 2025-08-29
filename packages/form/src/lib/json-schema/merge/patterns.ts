export function legacyPatternsMerger(a: string, b: string): string {
  return a === b ? a : `(?=${a})(?=${b})`;
}

export function simplePatternsMerger(a: string, b: string): string {
  return a === b ? a : `^(?=.*(?:${a}))(?=.*(?:${b})).*$`;
}
