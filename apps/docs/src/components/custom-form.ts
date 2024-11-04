import type { ErrorObject } from "ajv";
import { useForm, type UseFormOptions } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import { createValidator } from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

export type CustomOptions<T> = Omit<UseFormOptions<T, ErrorObject>, Defaults> &
  Partial<Pick<UseFormOptions<T, ErrorObject>, Defaults>>;

export function useCustomForm<T>(options: CustomOptions<T>) {
  const validator = createValidator();
  return useForm(
    Object.setPrototypeOf(options, {
      ...theme,
      validator,
      translation,
    })
  );
}
