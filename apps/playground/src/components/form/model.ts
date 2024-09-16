import type { JSONSchema7 } from "json-schema";
import type { Component, Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export interface FieldProps<T> {
  value: T;
  schema: JSONSchema7;
  disabled?: boolean;
  readonly?: boolean;
}

export interface FormComponentProps extends HTMLAttributes<HTMLFormElement> {
  children: Snippet;
}

export interface FormComponentExports {
  submitRequest: (submitter?: HTMLElement | null) => void;
  reset: () => void;
}

export type FormComponent = Component<FormComponentProps, FormComponentExports>;

export interface Components {
  Form: FormComponent;
}
