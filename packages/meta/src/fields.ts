import { EXTRA_FIELDS } from "./fields.generated.ts";
import { formPackage } from "./form.ts";

type ExtraFields = typeof EXTRA_FIELDS;

type ExtraFieldFileName = keyof ExtraFields;

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

export function* extraFields({
  wrappedFields = true,
}: ExtraFieldsFilter = {}): Iterable<ExtraFieldFileName> {
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
