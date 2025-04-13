import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLInputTypeAttribute,
  HTMLLabelAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";
import type {
  CalendarSingleRootProps,
  CheckboxRootProps,
  RadioGroupItemProps,
  RadioGroupRootProps,
  SelectMultipleRootProps,
  SelectSingleRootProps,
  SelectTriggerProps,
  SliderSingleRootProps,
  SwitchRootProps,
  WithoutChildrenOrChild,
} from "bits-ui";

type InputType = Exclude<HTMLInputTypeAttribute, "file">;

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

  shadcnCheckbox?: WithoutChildrenOrChild<CheckboxRootProps>;

  shadcnNumber?: Omit<HTMLInputAttributes, "type" | "files">;

  shadcnSelect?: Omit<SelectSingleRootProps, "type">;
  shadcnSelectTrigger?: SelectTriggerProps;

  shadcnText?: Omit<HTMLInputAttributes, "type"> & {
    type?: InputType;
    files?: undefined;
  };

  shadcnCheckboxes?: WithoutChildrenOrChild<CheckboxRootProps>;

  shadcnDatePicker?: Omit<
    WithoutChildrenOrChild<CalendarSingleRootProps>,
    "type"
  >;
  shadcnDatePickerTrigger?: HTMLButtonAttributes;

  shadcnFile?: Omit<HTMLInputAttributes, "type">;

  shadcnMultiSelect?: Omit<SelectMultipleRootProps, "type">;
  shadcnMultiSelectTrigger?: SelectTriggerProps;

  shadcnRadioGroup?: WithoutChildrenOrChild<RadioGroupRootProps>;
  shadcnRadioItem?: Omit<WithoutChildrenOrChild<RadioGroupItemProps>, "value">;

  shadcnRange?: Omit<WithoutChildrenOrChild<SliderSingleRootProps>, "type">;

  shadcnSwitch?: Omit<WithoutChildrenOrChild<SwitchRootProps>, "type">;

  shadcnTextarea?: HTMLTextareaAttributes;
}
