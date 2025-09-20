import { userEvent, type Locator } from "@vitest/browser/context";

import { enumeration, type FieldValidationTrigger } from "./schemas.js";

export function withTab(t: FieldValidationTrigger): FieldValidationTrigger {
  return async (l) => {
    await t(l);
    await userEvent.tab();
  };
}

export type Locate = (l: Locator) => Locator;

export function first(locate: Locate): Locate {
  return (l) => locate(l).first();
}

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

export function fill(locate: Locate): FieldValidationTrigger {
  return async (l) => {
    const input = locate(l);
    await input.fill("123");
  };
}

export const getTextbox = (l: Locator) => l.getByRole("textbox");

export const inputText = fill(getTextbox);

export const changeText = withTab(inputText);

export const getSpinButton = (l: Locator) => l.getByRole("spinbutton");

export const inputNumber = fill(getSpinButton);

export const changeNumber = withTab(inputNumber);

export const getCheckbox = first((l: Locator) => l.getByRole("checkbox"));

export const changeCheckbox = click(getCheckbox);

export const visitCheckbox = withTab(changeCheckbox);

export const getButton = (l: Locator) => l.getByRole("button");

export const changeFile = uploadFile(getButton);

export const visitFile = withTab(click(getButton, true));

export const getSelect = (l: Locator) => l.getByRole("combobox");

export const changeSelect = select(getSelect);

export const visitSelect = withTab(click(getSelect, true));
