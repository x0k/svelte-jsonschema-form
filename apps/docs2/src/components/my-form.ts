import { type FormOptions, type Validator, createForm } from "@sjsf/form";
import { resolver } from "@sjsf/form/resolvers/compat";
import { translation } from "@sjsf/form/translations/en";
import { createFormValidator } from "@sjsf/ajv8-validator";
import { theme } from "@sjsf/basic-theme";
import '@sjsf/form/fields/extra-fields/enum-include';

type Defaults = "theme" | "translation" | "validator" | "resolver";

export type MyValidator = ReturnType<typeof createFormValidator>;

export type MyFormOptions<T, V extends Validator> = Omit<
  FormOptions<T, V>,
  Defaults
> &
  Partial<Pick<FormOptions<T, V>, Defaults>>;

export function createMyForm<
  T,
  V extends Validator,
  O extends MyFormOptions<T, V>,
>(options: O) {
  // NOTE: we will create a separate validator for each form
  const validator = createFormValidator();
  const defaults: Pick<FormOptions<T, MyValidator>, Defaults> = {
    theme,
    resolver,
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
    }) as unknown as FormOptions<
      T,
      O extends { validator: V } ? V : MyValidator
    >
  );
}
