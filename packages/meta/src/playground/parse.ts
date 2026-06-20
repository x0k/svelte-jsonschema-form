import type { FormValue, UiSchema } from "@sjsf/form";
import { isObject, isRecord } from "@sjsf/form/lib/object";

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

function parseDefaultJsValue(code: string) {
  return parseJsValue(ensureExportDefault(code));
}

export async function parseSchemaObject(schemaStr: string) {
  const schemaObject = await parseDefaultJsValue(schemaStr);
  if (!isObject(schemaObject)) {
    throw new Error("Invalid Schema value, expected object");
  }
  return schemaObject;
}

export async function parseUiSchema(uiSchemaStr: string) {
  const uiSchema = await parseDefaultJsValue(uiSchemaStr);
  if (!isRecord(uiSchema)) {
    throw new Error("Invalid UI schema value, expected record");
  }
  return uiSchema as UiSchema;
}

export async function parseInitialValue(
  initialValueStr: string
): Promise<FormValue> {
  const initialValue = await parseDefaultJsValue(initialValueStr);
  return initialValue === null ? undefined : (initialValue as FormValue);
}
