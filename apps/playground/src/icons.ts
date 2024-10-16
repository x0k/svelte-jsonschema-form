import { icons as flowbite } from "@sjsf/flowbite-icons";
import { icons as lucide } from "@sjsf/lucide-icons";
import flowbiteIconsStyles from "@sjsf/flowbite-icons/styles.css?inline";
export const icons = {
  none: {},
  flowbite,
  lucide,
};
export const iconsStyles = {
  none: "",
  flowbite: flowbiteIconsStyles,
  lucide: "",
} satisfies Record<keyof typeof icons, string>;
