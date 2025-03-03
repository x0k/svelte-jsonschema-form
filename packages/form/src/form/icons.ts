import type { Snippet } from "svelte";

import type { Resolver } from "@/lib/resolver.js";

import type { Label, Labels } from "./translation.js";
import type { Config } from "./config.js";

export interface IconConfig<L extends Label> {
  config: Config;
  params: Labels[L];
  translation: string;
}

export type IconDefinition<L extends Label> = Snippet<[IconConfig<L>]>;

export type IconDefinitions = {
  [L in Label]: IconDefinition<L>;
};

export type Icons = Resolver<
  { [L in Label]?: IconConfig<L> },
  Partial<IconDefinitions>
>;
