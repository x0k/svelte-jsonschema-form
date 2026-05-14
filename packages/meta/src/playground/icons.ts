import type { Icons } from "@sjsf/form";
import { icons as lucide } from "@sjsf/lucide-icons";
import { icons as moving } from "@sjsf/moving-icons";
import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteStyles from "@sjsf/flowbite-icons/styles.css?raw";
import { icons as radix } from "@sjsf/radix-icons";

import { iconSets } from "../icons.ts";

function* playgroundIconSets() {
  yield "none";
  yield* iconSets();
}

const PLAYGROUND_ICON_SETS = Array.from(playgroundIconSets());

export type PlaygroundIconSet = (typeof PLAYGROUND_ICON_SETS)[number];

export const icons = {
  none: undefined,
  flowbite,
  lucide,
  moving,
  radix,
} satisfies Record<PlaygroundIconSet, Icons | undefined>;

export const iconsStyles = {
  none: "",
  flowbite: flowbiteStyles,
  lucide: "",
  moving: "",
  radix: "",
} satisfies Record<PlaygroundIconSet, string>;
