import { FIELDS, EXTRA_FIELDS } from "./fields.generated.ts";
import { formPackage } from "./form.ts";

type Fields = typeof FIELDS;

export type FieldFileName = keyof Fields;

type ExtraFields = typeof EXTRA_FIELDS;

export type ExtraFieldFileName = keyof ExtraFields;

export function* fields() {
  for (const f of Object.values(FIELDS)) {
    yield f.filename;
  }
}

const EXTRA_FIELD_WRAPPERS = new Map<
  ExtraFieldFileName,
  ExtraFieldFileName[]
>();

const EXTRA_FIELDS_LIST = Object.values(EXTRA_FIELDS);

for (const f of EXTRA_FIELDS_LIST) {
  if (f.wrapperOf === null) {
    continue;
  }
  let wrappers = EXTRA_FIELD_WRAPPERS.get(f.wrapperOf);
  if (wrappers === undefined) {
    wrappers = [];
    EXTRA_FIELD_WRAPPERS.set(f.wrapperOf, wrappers);
  }
  wrappers.push(f.filename);
}

export interface ExtraFieldsFilter {
  /** @default true */
  wrappedFields?: boolean;
}

export function* extraFields({ wrappedFields = true }: ExtraFieldsFilter = {}) {
  for (const f of EXTRA_FIELDS_LIST) {
    if (wrappedFields === false && EXTRA_FIELD_WRAPPERS.has(f.filename)) {
      continue;
    }
    yield f.filename;
  }
}

export function extraFieldSubPath(
  extraFieldName: ExtraFieldFileName,
  include = false,
) {
  return `${formPackage.name}/fields/extra/${extraFieldName}${include ? "-include" : ""}`;
}

// @slop
const EXTRA_FIELD_NAME_TO_FILE = new Map<string, ExtraFieldFileName>();
for (const [filename, entry] of Object.entries(EXTRA_FIELDS)) {
  EXTRA_FIELD_NAME_TO_FILE.set(entry.name, filename as ExtraFieldFileName);
}

export function extraFieldNameToFileName(
  name: string,
): ExtraFieldFileName | undefined {
  return EXTRA_FIELD_NAME_TO_FILE.get(name);
}
