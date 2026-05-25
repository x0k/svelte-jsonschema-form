import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLLabelAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";

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
   * Overrides the attributes of the errors list.
   */
  errorsList?: HTMLAttributes<HTMLUListElement>;

  form?: HTMLFormAttributes;
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

  datePicker?: HTMLInputAttributes;

  file?: HTMLInputAttributes;

  radio?: HTMLInputAttributes;

  range?: HTMLInputAttributes;

  textarea?: HTMLTextareaAttributes;
}
