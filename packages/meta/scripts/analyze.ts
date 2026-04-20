export function extractComponentPropsIndex(code: string): string | null {
  const start = code.indexOf("ComponentProps[");
  if (start === -1) return null;

  let i = start + "ComponentProps[".length;
  let depth = 1;
  let result = "";

  while (i < code.length) {
    const char = code[i];

    if (char === "[") depth++;
    else if (char === "]") depth--;

    if (depth === 0) break;

    result += char;
    i++;
  }

  return result.trim() || null;
}

export function resolveComponentName(
  raw: string,
  moduleConstants: Map<string, string> = new Map(),
): string | null {
  // "arrayFilesField"
  if (raw.startsWith('"') || raw.startsWith("'")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw.slice(1, -1);
    }
  }

  // typeof field
  const typeofMatch = raw.match(/^typeof\s+(\w+)$/);
  if (typeofMatch) {
    return moduleConstants.get(typeofMatch[1]!) ?? null;
  }

  return null;
}
