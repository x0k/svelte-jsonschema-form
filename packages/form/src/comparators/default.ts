import { isSchemaValueDeepEqual, type Comparator } from "#core/index.js";

/**
 * The default `Comparator`: compares plain records and arrays deeply and every
 * other pair with strict equality, except that `NaN` equals `NaN`.
 */
export const defaultComparator: Comparator = {
  isValueDeepEqual: isSchemaValueDeepEqual,
};
