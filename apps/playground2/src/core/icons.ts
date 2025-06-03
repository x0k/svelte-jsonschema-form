import { icons as lucide } from "@sjsf/lucide-icons";
import { icons as moving } from '@sjsf/moving-icons';

import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteStyles from "@sjsf/flowbite-icons/styles.css?inline";

import { icons as radix } from "@sjsf/radix-icons";

export const icons = {
  none: undefined,
  flowbite,
  lucide,
  moving,
  radix,
};

export const iconsStyles = {
  none: "",
  flowbite: flowbiteStyles,
  lucide: "",
  moving: "",
  radix: "",
} satisfies Record<keyof typeof icons, string>;
