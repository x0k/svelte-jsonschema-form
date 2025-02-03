import { theme as basic } from "@sjsf/form/basic-theme";

import { theme as daisy } from "@sjsf/daisyui-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";

import { theme as daisy5 } from '@sjsf/daisyui5-theme';
import daisy5Styles from '@sjsf/daisyui5-theme/styles.css?raw';

import { theme as flowbite } from "@sjsf/flowbite-theme";
import flowbiteStyles from "@sjsf/flowbite-theme/styles.css?inline";

import { theme as skeleton } from "@sjsf/skeleton-theme";
import skeletonStyles from "@sjsf/skeleton-theme/styles.css?inline";

import { theme as shadcn } from '@sjsf/shadcn-theme';
import shadcnStyles from '@sjsf/shadcn-theme/styles.css?inline';

export const themes = {
  basic,
  daisy,
  daisy5,
  flowbite,
  skeleton,
  shadcn
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
  daisy5: daisy5Styles,
  flowbite: flowbiteStyles,
  skeleton: skeletonStyles,
  shadcn: shadcnStyles
} satisfies Record<keyof typeof themes, string>;
