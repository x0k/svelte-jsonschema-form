import type { ComponentProps } from "svelte";
import type {
  HTMLAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
  HTMLInputTypeAttribute,
  HTMLTextareaAttributes,
} from "svelte/elements";
import type {
  CalendarSingleRootProps,
  CheckboxRootProps,
  LabelRootProps,
  RadioGroupItemProps,
  RadioGroupRootProps,
  SelectMultipleRootProps,
  SelectSingleRootProps,
  SelectTriggerProps,
  SliderSingleRootProps,
  SwitchRootProps,
  WithElementRef,
  WithoutChildrenOrChild,
  CommandInputProps,
  SingleToggleGroupRootPropsWithoutHTML,
  BitsPrimitiveDivAttributes,
  Without,
  ToggleGroupRootPropsWithoutHTML,
  ToggleGroupItemProps,
} from "bits-ui";
import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";
import type { Button } from "@sjsf/shadcn4-theme/new-york";

type InputType = Exclude<HTMLInputTypeAttribute, "file">;

type InputProps = WithElementRef<
  Omit<HTMLInputAttributes, "type"> &
    (
      | { type: "file"; files?: FileList }
      | { type?: InputType; files?: undefined }
    )
>;

type ToggleVariants = {
  variant?: "default" | "outline" | undefined;
  size?: "default" | "sm" | "lg" | undefined;
};

type ToggleGroupProps = SingleToggleGroupRootPropsWithoutHTML &
  Without<BitsPrimitiveDivAttributes, ToggleGroupRootPropsWithoutHTML> &
  ToggleVariants;

export interface UiOptions {
  shadcn4Button?: ComponentProps<typeof Button>;
  shadcn4Buttons?: {
    [B in ButtonType]: ComponentProps<typeof Button>;
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

  shadcn4Label?: LabelRootProps;
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
  shadcn4SubmitButton?: ComponentProps<typeof Button>;
  /**
   * Overrides the attributes of the field title
   */
  titleAttributes?: HTMLAttributes<HTMLDivElement>;

  shadcn4Checkbox?: WithoutChildrenOrChild<CheckboxRootProps>;

  shadcn4Number?: InputProps;

  shadcn4Select?: Omit<SelectSingleRootProps, "type">;
  shadcn4SelectTrigger?: SelectTriggerProps;

  shadcn4Text?: InputProps;

  shadcn4Checkboxes?: WithoutChildrenOrChild<CheckboxRootProps>;

  shadcn4ComboboxTrigger?: ComponentProps<typeof Button>;
  shadcn4ComboboxInput?: CommandInputProps;
  shadcn4ComboboxEmptyText?: string;

  shadcn4DatePicker?: Omit<
    WithoutChildrenOrChild<CalendarSingleRootProps>,
    "type"
  >;
  shadcn4DatePickerTrigger?: ComponentProps<typeof Button>;
  shadcn4DateFormatter?: (date: Date) => string;

  file?: HTMLInputAttributes;

  shadcn4MultiSelect?: Omit<SelectMultipleRootProps, "type">;
  shadcn4MultiSelectTrigger?: SelectTriggerProps;

  shadcn4RadioButtons?: ToggleGroupProps;
  shadcn4RadioButtonsItem?: ToggleGroupItemProps & ToggleVariants;

  shadcn4RadioGroup?: WithoutChildrenOrChild<RadioGroupRootProps>;
  shadcn4RadioItem?: Omit<WithoutChildrenOrChild<RadioGroupItemProps>, "value">;

  shadcn4Range?: Omit<WithoutChildrenOrChild<SliderSingleRootProps>, "type">;

  shadcn4Switch?: WithoutChildrenOrChild<SwitchRootProps>;

  textarea?: HTMLTextareaAttributes;
}
