export function simplePatternsMerger(a: string, b: string): string {
  return a === b ? (a.length > b.length ? b : a) : `^(?=${a})(?=${b}).*$`;
}
