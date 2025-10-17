import type {
  FieldAction,
  FieldActionType,
  FieldActionTypes,
} from "@/form/index.js";

export interface ExtraActions {}

export const definitions = {} as {
  [T in keyof ExtraActions & FieldActionType]: FieldAction<FieldActionTypes[T]>;
};
