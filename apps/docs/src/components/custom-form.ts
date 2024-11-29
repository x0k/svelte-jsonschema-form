import type { ErrorObject } from "ajv";
import { useForm2, type FormAPI, type UseFormOptions2 } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import { createValidator2 } from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

export type CustomOptions<T, E> = Omit<UseFormOptions2<T, E>, Defaults> &
  Partial<Pick<UseFormOptions2<T, E>, Defaults>>;

export function useCustomForm<T, E = ErrorObject>(
  options: CustomOptions<T, E>
): FormAPI<T, E> {
  const validator = createValidator2();
  const defaults: Pick<UseFormOptions2<T, ErrorObject>, Defaults> = {
    ...theme,
    validator,
    translation,
  };
  return useForm2(
    new Proxy(options, {
      get(target, p, receiver) {
        if (!(p in target)) {
          return defaults[p as Defaults];
        }
        return Reflect.get(target, p, receiver);
      },
    }) as UseFormOptions2<T, E>
  );
}
