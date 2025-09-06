// custom property names:
// Alphanumeric characters (a-z, A-Z, 0-9)
// Hyphens (-) are allowed as separators.
// Underscores (_) work but are less common.
// Custom properties must start with --.

export function formatAsCustomPropertyName(name: string): string {
  return `--${name.replaceAll(/[^A-Za-z0-9_-]/g, "-")}`;
}
