import type { ButtonType, LayoutType } from "@sjsf/form/fields/components";
import type {
  ComboboxRootProps,
  DatePickerRootProps,
  FileUploadRootProviderProps,
  PortalRootProps,
  RatingGroupRootProps,
  SegmentedControlItemProps,
  SegmentedControlRootProps,
  SliderRootProps,
  SwitchRootProps,
  TagsInputRootProps,
} from "@skeletonlabs/skeleton-svelte";
import type {
  HTMLAttributes,
  HTMLButtonAttributes,
  HTMLFormAttributes,
  HTMLInputAttributes,
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

  file?: HTMLInputAttributes;

  multiSelect?: HTMLSelectAttributes;

  radio?: HTMLInputAttributes;

  range?: HTMLInputAttributes;

  textarea?: HTMLTextareaAttributes;

  skeleton5Combobox?: ComboboxRootProps;
  skeleton5ComboboxPortal?: Omit<PortalRootProps, "children">;

  skeleton5DatePicker?: DatePickerRootProps;
  skeleton5DatePickerPortal?: Omit<PortalRootProps, "children">;

  skeleton5DateRangePicker?: DatePickerRootProps;
  skeleton5DateRangePickerPortal?: Omit<PortalRootProps, "children">;

  skeleton5FileUpload?: Omit<FileUploadRootProviderProps, "value">;

  skeleton5Segment?: SegmentedControlRootProps;
  skeleton5SegmentItem?: Omit<SegmentedControlItemProps, "value">;

  skeleton5RangeSlider?: SliderRootProps;

  skeleton5Rating?: RatingGroupRootProps;

  skeleton5Slider?: SliderRootProps;

  skeleton5Switch?: SwitchRootProps;

  skeleton5Tags?: TagsInputRootProps;
}
