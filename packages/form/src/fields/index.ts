import { createFields } from "@/form/index.js";

import {
  ArrayField,
  AnotherFieldArrayField,
  NormalArrayField,
  FixedArrayField,
  ArrayItemField,
} from "./array/index.js";
import { ObjectField, ObjectPropertyField } from "./object/index.js";

import RootField from "./root-field.svelte";
import NullField from "./null-field.svelte";
import NumberField from "./number-field.svelte";
import StringField from "./string-field.svelte";
import IntegerField from "./integer-field.svelte";
import BooleanField from "./boolean-field.svelte";
import EnumField from "./enum-field.svelte";
import MultiEnumField from "./multi-enum-field.svelte";
import HiddenField from "./hidden-field.svelte";
import FileField from "./file-field.svelte";
import FilesField from "./files-field.svelte";
import MultiField from "./multi-field.svelte";

export const fields = createFields({
  root: RootField,
  multi: MultiField,
  null: NullField,
  enum: EnumField,
  multiEnum: MultiEnumField,
  file: FileField,
  files: FilesField,
  integer: IntegerField,
  number: NumberField,
  boolean: BooleanField,
  string: StringField,
  object: ObjectField,
  objectProperty: ObjectPropertyField,
  array: ArrayField,
  anotherFieldArray: AnotherFieldArrayField,
  fixedArray: FixedArrayField,
  normalArray: NormalArrayField,
  arrayItem: ArrayItemField,
  hidden: HiddenField,
});
