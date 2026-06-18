import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";
import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLOutputAttributes,
  HTMLLabelAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

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

  switch?: HTMLInputAttributes;

  textarea?: HTMLTextareaAttributes;

  /**
   * Overrides the attributes of the switch widget container.
   */
  beercssSwitch?: HTMLInputAttributes;
  /**
   * Overrides the attributes of the description component.
   */
  beercssDescription?: HTMLAttributes<HTMLElement>;
  /**
   * Overrides the attributes of the help component.
   */
  beercssHelp?: HTMLOutputAttributes;
  /**
   * Overrides the attributes of the layout nav wrapper.
   */
  beercssNav?: HTMLAttributes<HTMLElement>;
  /**
   * Overrides the attributes of the checkboxes container.
   */
  beercssCheckboxesContainer?: HTMLAttributes<HTMLElement>;
  /**
   * Overrides the attributes of the radio container.
   */
  beercssRadioContainer?: HTMLAttributes<HTMLElement>;
}
