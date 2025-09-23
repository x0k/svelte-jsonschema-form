import { userEvent, type Locator } from "@vitest/browser/context";

import {
  enumeration,
  SWITCH_LABEL_TEXT,
  type FieldValidationTrigger,
} from "./schemas.js";

export function withTab(
  t: FieldValidationTrigger,
  shift = false
): FieldValidationTrigger {
  return async (l) => {
    await t(l);
    await userEvent.tab({ shift });
  };
}

export type Locate = (l: Locator) => Locator;

export function click(
  locate: Locate,
  escape?: boolean
): FieldValidationTrigger {
  return async (l) => {
    const input = locate(l);
    await userEvent.click(input);
    if (escape) {
      await userEvent.keyboard("{Escape}");
    }
  };
}

export const FAKE_FILE = new File(["file"], "file.png", { type: "image/png" });

export function uploadFile(locate: Locate): FieldValidationTrigger {
  return async (l) => {
    const input = locate(l);
    await input.upload(FAKE_FILE);
  };
}

export function select(locate: Locate): FieldValidationTrigger {
  return async (l) => {
    const input = locate(l);
    await input.selectOptions(enumeration.enum[0]);
  };
}

export function fill(locate: Locate, text = "123"): FieldValidationTrigger {
  return async (l) => {
    const input = locate(l);
    await input.fill(text);
  };
}

export const getTextbox = (l: Locator) => l.getByRole("textbox");
export const inputText = fill(getTextbox);
export const changeText = withTab(inputText);
export const visitText = changeText;

export const inputDate = fill(getTextbox, "2020-01-01");
export const changeDate = withTab(inputDate, true);
export const visitDate = changeDate;

export const getSpinButton = (l: Locator) => l.getByRole("spinbutton");
export const inputNumber = fill(getSpinButton);
export const changeNumber = withTab(inputNumber);
export const visitNumber = changeNumber;

export const getCheckbox = (l: Locator) => l.getByRole("checkbox").first();
export const inputCheckbox = click(getCheckbox);
export const changeCheckbox = inputCheckbox;
export const visitCheckbox = withTab(inputCheckbox);

export const getButton = (l: Locator) => l.getByRole("button").first();
export const changeFile = uploadFile(getButton);
export const visitFile = withTab(click(getButton, true));

export const getCombobox = (l: Locator) => l.getByRole("combobox");
export const inputSelect = select(getCombobox);
export const changeSelect = inputSelect;
export const visitSelect = withTab(click(getCombobox, true));

export const getListbox = (l: Locator) => l.getByRole("listbox");
export const inputMultiSelect = select(getListbox);
export const changeMultiSelect = inputMultiSelect;
export const visitMultiSelect = withTab(click(getListbox));

export const getRadio = (l: Locator) => l.getByRole("radio").last();
export const inputRadio = click(getRadio);
export const changeRadio = inputRadio;
export const visitRadio = withTab(inputRadio);

export const getSlider = (l: Locator) => l.getByRole("slider");
export const inputSlider: FieldValidationTrigger = async (l) => {
  const s = getSlider(l);
  await userEvent.type(s, "{arrowRight}");
};
export const changeSlider = inputSlider;
export const visitSlider = withTab(changeSlider);

export const inputTags = inputText;
export const changeTags: FieldValidationTrigger = async (l) => {
  await inputTags(l);
  await userEvent.keyboard("{Enter}");
};
export const visitTags = withTab(inputTags);

export const getSwitchLabel = (l: Locator, text = SWITCH_LABEL_TEXT) =>
  l.getByText(text);
export const inputSwitch = click(getSwitchLabel);
export const changeSwitch = inputSwitch;
export const visitSwitch = withTab(inputSwitch);

export const changeCallyDatePicker: FieldValidationTrigger = async (l) => {
  await customElements.whenDefined("calendar-date");
  await customElements.whenDefined("calendar-month");
  const button = getButton(l);
  await userEvent.click(button);
  const day = l.getByText("26");
  await userEvent.click(day);
};

export const inputFlowbiteMultiSelect: FieldValidationTrigger = async (l) => {
  const select = getListbox(l);
  await userEvent.click(select);
  const option = l.getByRole("presentation").last();
  await userEvent.click(option);
};

export const getFlowbiteRadioButton = (l: Locator) => l.getByText(enumeration.enum[0])
export const inputFlowbiteRadioButton = click(getFlowbiteRadioButton)
export const changeFlowbiteRadioButton = inputFlowbiteRadioButton
export const visitFlowbiteRadioButton = withTab(inputFlowbiteRadioButton)

export const inputShadcnSelect: FieldValidationTrigger = async (l) => {
  const select = getButton(l);
  await userEvent.click(select);
  const option = l.getByRole("option").last();
  await userEvent.click(option);
};
export const changeShadcnSelect = inputShadcnSelect;
export const visitShadcnSelect = withTab(inputShadcnSelect);

export const inputShadcnDatePicker: FieldValidationTrigger = async (l) => {
  const btn = getButton(l);
  await userEvent.click(btn);
  const day = l.getByText("26");
  await userEvent.click(day);
};
export const changeShadcnDatePicker = inputShadcnDatePicker;
export const visitShadcnDatePicker = withTab(inputShadcnDatePicker);

export const inputShadcnCombobox: FieldValidationTrigger = async (l) => {
  const cmb = getCombobox(l);
  await userEvent.click(cmb);
  const opt = l.getByRole("option").last();
  await userEvent.click(opt);
};
export const changeShadcnCombobox = inputShadcnCombobox;
export const visitShadcnCombobox = withTab(inputShadcnCombobox);

export const inputSkeletonCombobox: FieldValidationTrigger = async (l) => {
  const select = getButton(l);
  await userEvent.click(select);
  const option = l.getByText(enumeration.enum[0])
  await userEvent.click(option);
};
export const changeSkeletonCombobox = inputSkeletonCombobox;
export const visitSkeletonCombobox = withTab(inputSkeletonCombobox);

export const getRadioButtonLabel = (l: Locator) => l.getByTestId('segment-item').last();
export const inputSkeletonRadioButton = click(getRadioButtonLabel)
export const changeSkeletonRadioButton = inputSkeletonRadioButton

export const getFileInput = (l: Locator) => l.getByRole('button').nth(1)
export const changeSkeletonFile = uploadFile(getFileInput)
