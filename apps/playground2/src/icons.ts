import { icons as lucide } from "@sjsf/lucide-icons";

import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteIconsStyles from "@sjsf/flowbite-icons/styles.css?inline";

import { icons as radix } from "@sjsf/radix-icons";

export const icons = {
  none: undefined,
  flowbite,
  lucide,
  radix,
};

export const iconsStyles = {
  none: "",
  flowbite: flowbiteIconsStyles,
  lucide: "",
  radix: "",
} satisfies Record<keyof typeof icons, string>;
