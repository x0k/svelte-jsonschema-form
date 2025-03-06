import type { ErrorObject } from "ajv";
import {
  type FormState,
  type FormOptions,
  type Validator,
  createForm,
} from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/basic-theme";
import { createFormValidator } from "@sjsf/ajv8-validator";

type Defaults = "theme" | "validator" | "translation";

export type MyFormOptions<T, V extends Validator> = Omit<
  FormOptions<T, V>,
  Defaults
> &
  Partial<Pick<FormOptions<T, V>, Defaults>>;

export function createMyForm<
  T,
  V extends Validator,
>(options: MyFormOptions<T, V>): FormState<T, V> {
  // NOTE: we create a separate validator for each form
  const validator = createFormValidator() as V;
  const defaults: Pick<FormOptions<T, V>, Defaults> = {
    theme,
    validator,
    translation,
  };
  return createForm(
    new Proxy(options, {
      get(target, p, receiver) {
        if (!(p in target)) {
          return defaults[p as Defaults];
        }
        return Reflect.get(target, p, receiver);
      },
    }) as FormOptions<T, V>
  );
}
