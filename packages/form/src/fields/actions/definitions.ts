import type {
  FieldAction,
  FieldActionType,
  FieldActionTypes,
} from "@/form/index.js";

export interface ExtraActions {}

export const definitions = {} as Pick<
  {
    [T in FieldActionType]: FieldAction<FieldActionTypes[T]>;
  },
  keyof ExtraActions
>;
