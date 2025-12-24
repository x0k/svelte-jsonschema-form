import type {
  ClassValue,
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLLabelAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";
import type { CalendarDateProps } from "cally";
import type { PikadayOptions } from "pikaday";

type MapEvents<T> = {
  [K in keyof T as K extends `on${infer E}` ? `on:${Lowercase<E>}` : K]: T[K];
};

type CalendarProps = MapEvents<CalendarDateProps> & {
  class?: ClassValue | null;
  placeholder?: string;
};

export interface UiOptions {
  /**
   * Overrides the attributes of any button component.
   */
  button?: HTMLButtonAttributes;
  /**
   * Overrides the attributes of a button with a specific type.
   * This override takes precedence over the `button` override, but does not replace it.
   */
  buttons?: {
    [B in ButtonType]?: HTMLButtonAttributes;
  };
  /**
   * Overrides the attributes of the description.
   */
  descriptionAttributes?: HTMLAttributes<HTMLDivElement>;
  /**
   * Overrides the attributes of the errors list.
   */
  errorsList?: HTMLAttributes<HTMLUListElement>;

  form?: HTMLFormAttributes;
  /**
   * Overrides the attributes of the help.
   */
  helpAttributes?: HTMLAttributes<HTMLDivElement>;
  /**
   * Overrides the attributes of the field label.
   */
  labelAttributes?: HTMLLabelAttributes;
  /**
   * Overrides the attributes of any layout component.
   */
  layout?: HTMLAttributes<HTMLDivElement>;
  /**
   * Overrides the attributes of a layout with a specific type.
   * This override takes precedence over the `layout` override, but does not replace it.
   */
  layouts?: {
    [L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
  };
  submitButton?: HTMLButtonAttributes;
  /**
   * Overrides the attributes of the field title
   */
  titleAttributes?: HTMLAttributes<HTMLDivElement>;

  checkbox?: HTMLInputAttributes;

  number?: HTMLInputAttributes;

  select?: HTMLSelectAttributes;

  text?: HTMLInputAttributes;

  checkboxes?: HTMLInputAttributes;

  colorPicker?: HTMLInputAttributes;

  datePicker?: HTMLInputAttributes;

  file?: HTMLInputAttributes;

  multiSelect?: HTMLSelectAttributes;

  passwordInput?: HTMLInputAttributes;

  radio?: HTMLInputAttributes;

  range?: HTMLInputAttributes;

  textarea?: HTMLTextareaAttributes;

  daisyui5CallyCalendar?: CalendarProps;

  daisyui5CallyCalendarDateFormatter?: (date: string) => string;
  daisyui5CallyCalendarTrigger?: HTMLButtonAttributes;

  daisyui5Filter?: HTMLAttributes<HTMLDivElement>;
  daisyui5FilterItem?: HTMLInputAttributes;

  daisyui5PikadayCalendar?: HTMLInputAttributes;
  daisyui5PikadayCalendarOptions?: PikadayOptions;

  daisyui5RadioButtons?: HTMLInputAttributes;

  daisyui5Rating?: HTMLInputAttributes;

  daisyui5Switch?: HTMLInputAttributes;
}
