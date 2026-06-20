import { importModule } from "../modules.ts";

const EXPORT_DEFAULT = "export default";

function ensureExportDefault(raw: string) {
  const str = raw.trim();
  return str.includes(EXPORT_DEFAULT) ? str : `${EXPORT_DEFAULT} ${str}`;
}

async function parseJsValue(code: string) {
  const m = await importModule<unknown>(code);
  if (!m || typeof m !== "object" || !("default" in m)) {
    throw new Error("Failed to parse");
  }
  return m.default;
}

export function parseDefaultJsValue(code: string) {
  return parseJsValue(ensureExportDefault(code));
}
