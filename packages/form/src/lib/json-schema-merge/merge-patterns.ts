export function simplePatternsMerger(p: string, q: string): string {
  return p === q ? p : `^(?=${p})(?=${q}).*$`;
}
