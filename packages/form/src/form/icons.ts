import type { Snippet } from "svelte";

import type { Resolver } from "@/lib/resolver.js";

import type { Label, Labels } from "./translation.js";
import type { Config } from "./config.js";

export interface IconConfig<L extends Label> {
  config: Config;
  params: Labels[L];
  translation: string;
}

export type Icon<L extends Label> = Snippet<[IconConfig<L>]>;

export type Icons = {
  [L in Label]: Icon<L>;
};

export type IconsResolver = Resolver<
  {
    [L in Label]: IconConfig<L>;
  },
  Icons
>;
