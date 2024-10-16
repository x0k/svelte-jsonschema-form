import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteIconsStyles from "@sjsf/flowbite-icons/styles.css?inline";
export const icons = {
  none: {},
  flowbite,
};
export const iconsStyles = {
  none: "",
  flowbite: flowbiteIconsStyles,
} satisfies Record<keyof typeof icons, string>;
