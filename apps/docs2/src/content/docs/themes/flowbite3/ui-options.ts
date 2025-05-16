import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
} from "svelte/elements";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/exports";
import type {
  ButtonGroupProps,
  ButtonProps as ButtonPropsUnion,
  CheckboxProps,
  DatepickerProps,
  FileuploadProps,
  HelperProps,
  InputProps,
  LabelProps,
  MultiSelectProps,
  RadioProps,
  RangeProps,
  SelectProps,
  TagsProps,
  TextareaProps,
  ToggleProps,
} from "flowbite-svelte3";

type ButtonProps = Extract<
  ButtonPropsUnion,
  { type?: HTMLButtonAttributes["type"] }
>;

export interface UiOptions {
  flowbite3Button?: ButtonProps;
  flowbite3Buttons?: {
    [B in ButtonType]?: ButtonProps;
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

  flowbite3Help?: HelperProps;

  flowbite3Label?: LabelProps;
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
  flowbite3ButtonGroup?: ButtonGroupProps;

  flowbite3SubmitButton?: ButtonProps;
  /**
   * Overrides the attributes of the field title
   */
  titleAttributes?: HTMLAttributes<HTMLDivElement>;

  flowbite3Checkbox?: CheckboxProps;

  flowbite3Number?: InputProps<number | undefined>;

  flowbite3Select?: SelectProps<number>;

  flowbite3Text?: InputProps<string | undefined>;

  flowbite3Checkboxes?: CheckboxProps;

  flowbite3Datepicker?: DatepickerProps;

  flowbite3File?: FileuploadProps;

  flowbite3MultiSelect?: Omit<MultiSelectProps<number>, "value">;

  flowbite3Radio?: RadioProps<number>;

  flowbite3Range?: RangeProps;

  flowbite3Switch?: ToggleProps;

  flowbite3Tags?: Omit<TagsProps, "value">;

  flowbite3Textarea?: TextareaProps;
}
