import type { Icons } from "@sjsf/form";
import { icons as lucide } from "@sjsf/lucide-icons";
import { icons as moving } from "@sjsf/moving-icons";
import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteStyles from "@sjsf/flowbite-icons/styles.css?raw";
import { icons as radix } from "@sjsf/radix-icons";

import type { Generated } from "../types.ts";
import { iconSets } from "../icons.ts";

export function* playgroundIconSets() {
  yield "none";
  yield* iconSets();
}

export type PlaygroundIconSet = Generated<typeof playgroundIconSets>;

export const PLAYGROUND_ICON_SETS = {
  none: undefined,
  flowbite,
  lucide,
  moving,
  radix,
} satisfies Record<PlaygroundIconSet, Icons | undefined>;

export const PLAYGROUND_ICON_SET_STYLES = {
  none: "",
  flowbite: flowbiteStyles,
  lucide: "",
  moving: "",
  radix: "",
} satisfies Record<PlaygroundIconSet, string>;
