import type { ComponentInternals } from "svelte";
import Ajv, { type ErrorObject } from "ajv";
import { Form, type FormProps } from "@sjsf/form";
import { translation } from "@sjsf/form/translations/en";
import { theme } from "@sjsf/form/basic-theme";
import {
  AjvValidator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";

type Defaults = "widgets" | "components" | "validator" | "translation";

type Props<T> = Omit<FormProps<T, ErrorObject>, Defaults> &
  Partial<Pick<FormProps<T, ErrorObject>, Defaults>>;

export function CustomForm<T>(internals: ComponentInternals, props: Props<T>) {
  const defaults = {
    ...theme,
    translation,
    validator: new AjvValidator(addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))),
  };
  return Form(
    internals,
    new Proxy(props, {
      get(target, p, receiver) {
        const original = Reflect.get(target, p, receiver);
        return p in defaults ? (original ?? defaults[p as Defaults]) : original;
      },
    }) as FormProps<T, ErrorObject>
  );
}
