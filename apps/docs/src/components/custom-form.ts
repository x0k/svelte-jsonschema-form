import Ajv, { type ErrorObject } from "ajv";
import { useForm, type UseFormOptions } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import {
  AjvValidator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

export type CustomOptions<T> = Omit<UseFormOptions<T, ErrorObject>, Defaults> &
  Partial<Pick<UseFormOptions<T, ErrorObject>, Defaults>>;

export function useCustomForm<T>(options: CustomOptions<T>) {
  const validator = new AjvValidator(
    addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
  );
  return useForm(
    Object.setPrototypeOf(options, {
      ...theme,
      validator,
      translation,
    })
  );
}
