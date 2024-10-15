import { theme as basic } from "@sjsf/form/basic-theme";
import { theme as daisy } from "@sjsf/daisyui-theme";
import { theme as flowbite } from "@sjsf/flowbite-theme";
import { theme as skeleton } from "@sjsf/skeleton-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";
import flowbiteStyles from "@sjsf/flowbite-theme/styles.css?inline";
import skeletonStyles from "@sjsf/skeleton-theme/styles.css?inline";

export const themes = {
  basic,
  daisy,
  flowbite,
  skeleton,
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
  flowbite: flowbiteStyles,
  skeleton: skeletonStyles,
} satisfies Record<keyof typeof themes, string>;
