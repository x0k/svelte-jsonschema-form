import type { Context } from "./model.js";

export function svelteKit({ isKit }: Context) {
  if (!isKit) {
    return;
  }
}
