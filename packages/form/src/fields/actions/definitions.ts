import type {
  FieldAction,
  FieldActionType,
  FieldActionTypes,
} from "@/form/index.js";

export const definitions = {} as {
  [T in FieldActionType]: FieldAction<FieldActionTypes[T]>;
};
