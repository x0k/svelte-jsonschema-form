import { theme as basic } from "@sjsf/form/basic-theme";

import { theme as daisy } from "@sjsf/daisyui-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";

import { theme as flowbite } from "@sjsf/flowbite-theme";
import flowbiteStyles from "@sjsf/flowbite-theme/styles.css?inline";

import { theme as skeleton } from "@sjsf/skeleton-theme";
import skeletonStyles from "@sjsf/skeleton-theme/styles.css?inline";

import { theme as shadcn } from '@sjsf/shadcn-theme';
import shadcnStyles from '@sjsf/shadcn-theme/styles.css?inline';

export const themes = {
  basic,
  daisy,
  flowbite,
  skeleton,
  shadcn
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
  flowbite: flowbiteStyles,
  skeleton: skeletonStyles,
  shadcn: shadcnStyles
} satisfies Record<keyof typeof themes, string>;
