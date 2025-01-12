import type { ErrorObject } from "ajv";
import { type FormInternals, type FormState, type FormOptions, createForm3 } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import { createValidator2 } from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

export type CustomOptions<T, E> = Omit<FormOptions<T, E>, Defaults> &
  Partial<Pick<FormOptions<T, E>, Defaults>>;

export function createCustomForm<T, E = ErrorObject>(
  options: CustomOptions<T, E>
): FormState<T, E> & FormInternals {
  const validator = createValidator2();
  const defaults: Pick<FormOptions<T, ErrorObject>, Defaults> = {
    ...theme,
    validator,
    translation,
  };
  return createForm3(
    new Proxy(options, {
      get(target, p, receiver) {
        if (!(p in target)) {
          return defaults[p as Defaults];
        }
        return Reflect.get(target, p, receiver);
      },
    }) as FormOptions<T, E>
  );
}
