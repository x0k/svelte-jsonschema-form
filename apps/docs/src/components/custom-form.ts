import type { ErrorObject } from "ajv";
import { useForm, type FormAPI, type UseFormOptions } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import { createValidator } from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

export type CustomOptions<T, E> = Omit<UseFormOptions<T, E>, Defaults> &
  Partial<Pick<UseFormOptions<T, E>, Defaults>>;

export function useCustomForm<T, E = ErrorObject>(options: CustomOptions<T, E>): FormAPI<T, E> {
  const validator = createValidator();
  return useForm(
    Object.setPrototypeOf(options, {
      ...theme,
      validator,
      translation,
    })
  );
}
