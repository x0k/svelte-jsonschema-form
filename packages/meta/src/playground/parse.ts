import { isRecord } from "@sjsf/form/lib/object";

import { importModule } from "../modules.ts";

export const EXPORT_DEFAULT = "export default";

export function ensureExportDefault(raw: string) {
  const str = raw.trim();
  return str.includes(EXPORT_DEFAULT) ? str : `${EXPORT_DEFAULT} ${str}`;
}

export async function parseJsValue(code: string) {
  const m = await importModule<unknown>(code);
  if (!m || typeof m !== "object" || !("default" in m)) {
    return Promise.reject(new Error("Failed to parse"));
  }
  return m.default;
}

// TODO: Remove in v4
export async function parseJsRecord<S extends object>(str: string | S) {
  if (typeof str !== "string") {
    return str;
  }
  const value = await parseJsValue(str);
  if (!isRecord(value)) {
    throw new Error("Not a record");
  }
  return value as S;
}
