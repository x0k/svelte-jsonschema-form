import type { Snippet } from "svelte";

import type { Label, Labels } from "./translation.js";

export type Icons = {
  [L in Label]?: Snippet<[[L, ...Labels[L]]]>;
};
