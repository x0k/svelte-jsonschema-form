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
  flowbiteButton?: ButtonProps;
  flowbiteButtons?: {
    [B in ButtonType]?: ButtonProps;
  };

  flowbiteDescription?: HTMLAttributes<HTMLDivElement>;

  flowbiteErrorsList?: HTMLAttributes<HTMLUListElement>;

  flowbiteForm?: HTMLFormAttributes;

  flowbiteHelp?: HelperProps;

  flowbiteLabel?: LabelProps;

  flowbiteLayout?: HTMLAttributes<HTMLDivElement>;
  flowbiteLayouts?: {
    [L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
  };
  flowbiteButtonGroup?: ButtonGroupProps;

  flowbiteSubmitButton?: ButtonProps;

  flowbiteTitle?: HTMLAttributes<HTMLParagraphElement>;

  flowbiteCheckbox?: CheckboxProps;

  flowbiteNumber?: InputProps<number | undefined>;

  flowbiteSelect?: SelectProps<number>;

  flowbiteText?: InputProps<string | undefined>;

  flowbiteCheckboxes?: CheckboxProps;

  flowbiteDatepicker?: DatepickerProps;

  flowbiteFile?: FileuploadProps;

  flowbiteMultiSelect?: MultiSelectProps<number>;

  flowbiteRadio?: RadioProps<number>;

  flowbiteRange?: RangeProps;

  flowbiteSwitch?: ToggleProps;

  flowbiteTextarea?: TextareaProps;
}
