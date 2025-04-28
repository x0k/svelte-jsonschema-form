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

  flowbite3Description?: HTMLAttributes<HTMLDivElement>;

  flowbite3ErrorsList?: HTMLAttributes<HTMLUListElement>;

  flowbite3Form?: HTMLFormAttributes;

  flowbite3Help?: HelperProps;

  flowbite3Label?: LabelProps;

  flowbite3Layout?: HTMLAttributes<HTMLDivElement>;
  flowbite3Layouts?: {
    [L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
  };
  flowbite3ButtonGroup?: ButtonGroupProps;

  flowbite3SubmitButton?: ButtonProps;

  flowbite3Title?: HTMLAttributes<HTMLParagraphElement>;

  flowbite3Checkbox?: CheckboxProps;

  flowbite3Number?: InputProps<number | undefined>;

  flowbite3Select?: SelectProps<number>;

  flowbite3Text?: InputProps<string | undefined>;

  flowbite3Checkboxes?: CheckboxProps;

  flowbite3Datepicker?: DatepickerProps;

  flowbite3File?: FileuploadProps;

  flowbite3MultiSelect?: MultiSelectProps<number>;

  flowbite3Radio?: RadioProps<number>;

  flowbite3Range?: RangeProps;

  flowbite3Switch?: ToggleProps;

  flowbite3Textarea?: TextareaProps;
}
