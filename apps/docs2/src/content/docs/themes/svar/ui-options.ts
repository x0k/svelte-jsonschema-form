import type { ButtonType } from "@sjsf/form/fields/components";
import {
  Button as SvarButton,
  Checkbox as SvarCheckbox,
  CheckboxGroup as SvarCheckboxGroup,
  ColorPicker as SvarColorPicker,
  ColorSelect as SvarColorSelect,
  Combo,
  DatePicker as SvarDatePicker,
  DateRangePicker as SvarDateRangePicker,
  MultiCombo as SvarMultiCombo,
  RadioButtonGroup as SvarRadioButtonGroup,
  Segmented,
  Select as SvarSelect,
  Slider as SvarSlider,
  Switch as SvarSwitch,
  TextArea as SvarTextArea,
  Text as SvarText,
} from "@svar-ui/svelte-core";
import type { ComponentProps as SvelteComponentProps } from "svelte";

export interface UiOptions {
  /**
   * Overrides the props of the text input widget.
   */
  svarText?: SvelteComponentProps<typeof SvarText>;
  /**
   * Overrides the props of the number input widget.
   */
  svarNumber?: SvelteComponentProps<typeof SvarText>;
  /**
   * Overrides the props of the select widget.
   */
  savrSelect?: SvelteComponentProps<typeof SvarSelect>;
  /**
   * Overrides the props of the checkbox widget.
   */
  svarCheckbox?: SvelteComponentProps<typeof SvarCheckbox>;
  /**
   * Overrides the props of the checkboxes widget.
   */
  svarCheckboxes?: SvelteComponentProps<typeof SvarCheckboxGroup>;
  /**
   * Overrides the props of the color picker widget.
   */
  svarColorPicker?: SvelteComponentProps<typeof SvarColorPicker>;
  /**
   * Overrides the props of the color select widget.
   */
  svarColorSelect?: SvelteComponentProps<typeof SvarColorSelect>;
  /**
   * Overrides the props of the combobox widget.
   */
  svarCombobox?: SvelteComponentProps<typeof Combo>;
  /**
   * Overrides the props of the date picker widget.
   */
  svarDatePicker?: SvelteComponentProps<typeof SvarDatePicker>;
  /**
   * Overrides the props of the date range picker widget.
   */
  svarDateRangePicker?: SvelteComponentProps<typeof SvarDateRangePicker>;
  /**
   * Overrides the props of the multi-select widget.
   */
  svarMultiSelect?: SvelteComponentProps<typeof SvarMultiCombo>;
  /**
   * Overrides the props of the radio buttons (segmented) widget.
   */
  svarRadioButtons?: SvelteComponentProps<typeof Segmented>;
  /**
   * Overrides the props of the radio widget.
   */
  svarRadio?: SvelteComponentProps<typeof SvarRadioButtonGroup>;
  /**
   * Overrides the props of the range (slider) widget.
   */
  svarRange?: SvelteComponentProps<typeof SvarSlider>;
  /**
   * Overrides the props of the switch widget.
   */
  svarSwitch?: SvelteComponentProps<typeof SvarSwitch>;
  /**
   * Overrides the props of the textarea widget.
   */
  svarTextarea?: SvelteComponentProps<typeof SvarTextArea>;
  /**
   * Overrides the props of the button component.
   */
  svarButton?: SvelteComponentProps<typeof SvarButton>;
  /**
   * Overrides the props of a button with a specific type.
   */
  svarButtons?: {
    [B in ButtonType]: SvelteComponentProps<typeof SvarButton>;
  };
  /**
   * Overrides the props of the submit button component.
   */
  svarSubmitButton?: SvelteComponentProps<typeof SvarButton>;
}
