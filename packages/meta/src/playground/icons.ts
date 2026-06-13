import type { Icons } from "@sjsf/form";
import { icons as lucide } from "@sjsf/lucide-icons";
import "@sjsf/lucide-icons/extra/clear-include.svelte";
import "@sjsf/lucide-icons/extra/edit-include.svelte";
import { icons as moving } from "@sjsf/moving-icons";
import "@sjsf/moving-icons/extra/clear-include.svelte";
import "@sjsf/moving-icons/extra/edit-include.svelte";
import { icons as flowbite } from "@sjsf/flowbite-icons";
import "@sjsf/flowbite-icons/extra/clear-include.svelte";
import "@sjsf/flowbite-icons/extra/edit-include.svelte";
import flowbiteStyles from "@sjsf/flowbite-icons/styles.css?raw";
import { icons as radix } from "@sjsf/radix-icons";
import "@sjsf/radix-icons/extra/clear-include.svelte";
import "@sjsf/radix-icons/extra/edit-include.svelte";

import type { PlaygroundIconSet } from "./model.ts";

export const PLAYGROUND_ICON_SETS: Record<
  PlaygroundIconSet,
  Icons | undefined
> = {
  none: undefined,
  flowbite,
  lucide,
  moving,
  radix,
};

export const PLAYGROUND_ICON_SET_STYLES = {
  none: "",
  flowbite: flowbiteStyles,
  lucide: "",
  moving: "",
  radix: "",
} satisfies Record<PlaygroundIconSet, string>;
