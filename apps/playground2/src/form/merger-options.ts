import type { FormState } from "meta/playground";

export function getChangedMergerOptionsCount(
  options: Pick<
    FormState,
    | "arrayMinItemsPopulate"
    | "arrayMinItemsMergeExtraDefaults"
    | "allOf"
    | "constAsDefault"
    | "emptyObjectFields"
    | "mergeDefaultsIntoFormData"
  >,
): number {
  let count = 0;
  if (options.arrayMinItemsPopulate !== "all") count++;
  if (options.arrayMinItemsMergeExtraDefaults !== false) count++;
  if (options.allOf !== "skipDefaults") count++;
  if (options.constAsDefault !== "always") count++;
  if (options.emptyObjectFields !== "populateAllDefaults") count++;
  if (options.mergeDefaultsIntoFormData !== "useFormDataIfPresent") count++;
  return count;
}
