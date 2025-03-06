import { type Snippet } from "svelte";

import type { Theme } from "@/shared";

let context: ShowcaseContext;

export interface ShowcaseContext {
  addTheme(name: Theme, snippet: Snippet): void;
  selected: Theme
}

export function setShowcaseContext(ctx: ShowcaseContext) {
  context = ctx;
}

export function getShowcaseContext(): ShowcaseContext {
  return context;
}
