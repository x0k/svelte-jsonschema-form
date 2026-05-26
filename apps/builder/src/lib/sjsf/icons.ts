import type { Icons as SJSFIcons } from "@sjsf/form";
import type { PlaygroundIconSet } from "meta/playground";

import { icons as lucide } from "@sjsf/lucide-icons";
import { icons as moving } from "@sjsf/moving-icons";
import { icons as flowbite } from "@sjsf/flowbite-icons";
import { icons as radix } from "@sjsf/radix-icons";

export const SJSF_ICONS: Record<PlaygroundIconSet, SJSFIcons | undefined> = {
  none: undefined,
  flowbite,
  moving,
  lucide,
  radix
};
