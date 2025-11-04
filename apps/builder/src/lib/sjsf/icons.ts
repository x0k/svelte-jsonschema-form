import type { Icons as SJSFIcons } from "@sjsf/form";

import { icons as lucide } from "@sjsf/lucide-icons";
import { icons as moving } from "@sjsf/moving-icons";

import { icons as flowbite } from "@sjsf/flowbite-icons";
import flowbiteStyles from "@sjsf/flowbite-icons/styles.css?inline";

import { icons as radix } from "@sjsf/radix-icons";

export enum Icons {
  None = "none",
  Flowbite = "flowbite",
  Moving = "moving",
  Lucide = "lucide",
  Radix = "radix",
}

export const ICONS = Object.values(Icons);

export const ICONS_TITLES: Record<Icons, string> = {
  [Icons.None]: "None",
  [Icons.Flowbite]: "Flowbite",
  [Icons.Moving]: "Moving",
  [Icons.Lucide]: "Lucide",
  [Icons.Radix]: "Radix",
};

export const ICONS_PEER_DEPS: Record<Icons, string> = {
  [Icons.None]: "",
  [Icons.Flowbite]: "flowbite-svelte-icons",
  [Icons.Moving]: "@jis3r/icons",
  [Icons.Lucide]: "@lucide/svelte",
  [Icons.Radix]: "svelte-radix",
}

export const SJSF_ICONS: Record<Icons, SJSFIcons | undefined> = {
  [Icons.None]: undefined,
  [Icons.Flowbite]: flowbite,
  [Icons.Moving]: moving,
  [Icons.Lucide]: lucide,
  [Icons.Radix]: radix,
};

export const ICONS_STYLES: Record<Icons, string> = {
  [Icons.None]: "",
  [Icons.Flowbite]: flowbiteStyles,
  [Icons.Lucide]: "",
  [Icons.Moving]: "",
  [Icons.Radix]: "",
};

export const ICONS_APP_CSS: Record<Icons, string> = {
  [Icons.None]: "",
  [Icons.Flowbite]: '@source "../node_modules/@sjsf/flowbite-icons/dist";',
  [Icons.Lucide]: "",
  [Icons.Moving]: "",
  [Icons.Radix]: "",
};
