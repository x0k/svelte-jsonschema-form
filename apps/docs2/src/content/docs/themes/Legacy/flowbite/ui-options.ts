import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
} from "svelte/elements";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/exports";
import type { ButtonProps as ButtonPropsUnion } from "flowbite-svelte2/Button.svelte";
import type { HelperProps } from "flowbite-svelte2/Helper.svelte";
import type { LabelProps } from "flowbite-svelte2/Label.svelte";
import type { ButtonGroupProps } from "flowbite-svelte2/ButtonGroup.svelte";
import type { CheckboxProps } from "flowbite-svelte2/Checkbox.svelte";
import type { NumberInputProps } from "flowbite-svelte2/NumberInput.svelte";
import type { SelectProps } from "flowbite-svelte2/Select.svelte";
import type { InputProps } from "flowbite-svelte2/Input.svelte";
import type { DatepickerProps } from "flowbite-svelte2/Datepicker.svelte";
import type { FileuploadProps } from "flowbite-svelte2/Fileupload.svelte";
import type { MultiSelectProps } from "flowbite-svelte2/MultiSelect.svelte";
import type { RadioProps } from "flowbite-svelte2/Radio.svelte";
import type { RangeProps } from "flowbite-svelte2/Range.svelte";
import type { ToggleProps } from "flowbite-svelte2/Toggle.svelte";
import type { TextareaProps } from "flowbite-svelte2/Textarea.svelte";

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

  flowbiteNumber?: NumberInputProps;

  flowbiteSelect?: SelectProps;

  flowbiteText?: InputProps;

  flowbiteCheckboxes?: CheckboxProps;

  flowbiteDatepicker?: DatepickerProps;

  flowbiteFile?: FileuploadProps;

  flowbiteMultiSelect?: MultiSelectProps;

  flowbiteRadio?: RadioProps;

  flowbiteRange?: RangeProps;

  flowbiteSwitch?: ToggleProps;

  flowbiteTextarea?: TextareaProps;
}
