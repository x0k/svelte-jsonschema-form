import { theme as basic } from "@sjsf/form/basic-theme";
import { theme as daisy } from "@sjsf/daisyui-theme";
import { theme as flowbite } from "@sjsf/flowbite-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";
import flowbiteStyles from "@sjsf/flowbite-theme/styles.css?inline";

export const themes = {
  basic,
  daisy,
  flowbite,
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
  flowbite: flowbiteStyles,
} satisfies Record<keyof typeof themes, string>;
