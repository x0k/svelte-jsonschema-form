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
} from "@skeletonlabs/skeleton-svelte4";

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

  skeleton4Combobox?: ComboboxRootProps;
  skeleton4ComboboxPortal?: Omit<PortalRootProps, "children">;

  skeleton4DatePicker?: DatePickerRootProps;
  skeleton4DatePickerPortal?: Omit<PortalRootProps, "children">;

  skeleton4DateRangePicker?: DatePickerRootProps;
  skeleton4DateRangePickerPortal?: Omit<PortalRootProps, "children">;

  skeleton4FileUpload?: Omit<FileUploadRootProviderProps, "value">;

  skeleton4Segment?: SegmentedControlRootProps;
  skeleton4SegmentItem?: Omit<SegmentedControlItemProps, "value">;

  skeleton4RangeSlider?: SliderRootProps;

  skeleton4Rating?: RatingGroupRootProps;

  skeleton4Slider?: SliderRootProps;

  skeleton4Switch?: SwitchRootProps;

  skeleton4Tags?: TagsInputRootProps;
}
