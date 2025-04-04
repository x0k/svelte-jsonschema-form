import { type FormOptions, type Validator, createForm } from "@sjsf/form";

import * as defaults from "./form-defaults";

type Defaults = keyof typeof defaults;

export type MyValidator = (typeof defaults)["validator"];

export type MyFormOptions<T, V extends Validator> = Omit<
  FormOptions<T, V>,
  Defaults
> &
  Partial<Pick<FormOptions<T, V>, Defaults>>;

export function createMyForm<
  T,
  V extends Validator,
  O extends MyFormOptions<T, V>
>(options: O) {
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
