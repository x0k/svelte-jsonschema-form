import { isSchemaValueDeepEqual } from "#core/index.js";
import { copyForChange, type FormValueHandler } from "#form/main.js";

/**
 * The default `FormValueHandler`: compares plain records and arrays deeply and
 * copies them recursively. Other values, such as `File`, are compared and kept
 * by identity.
 */
export const defaultFormValueHandler: FormValueHandler = {
  isValueDeepEqual: isSchemaValueDeepEqual,
  copyForChange,
};
