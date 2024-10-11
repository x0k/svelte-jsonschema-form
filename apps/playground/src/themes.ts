import { theme as basic } from "@sjsf/form/basic-theme";
import { theme as daisy } from "@sjsf/daisyui-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";

export const themes = {
  basic,
  daisy,
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
} satisfies Record<keyof typeof themes, string>;
