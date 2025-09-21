import { userEvent, type Locator } from "@vitest/browser/context";

import { enumeration, type FieldValidationTrigger } from "./schemas.js";

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

export const SWITCH_LABEL_TEXT = "switch";
export const getSwitchLabel = (l: Locator, text = SWITCH_LABEL_TEXT) =>
  l.getByText(text);
export const inputSwitch = click(getSwitchLabel);
export const changeSwitch = inputSwitch;
export const visitSwitch = withTab(inputSwitch);
