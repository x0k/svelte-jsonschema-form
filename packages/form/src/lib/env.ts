import { BROWSER } from "esm-env";

import type { AnyComponent } from "./component.js";
import { dynamic, type DynamicOptions } from "./dynamic.svelte";

export class EnvError {}

// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
const rejected = () => Promise.reject(new EnvError());

export function clientOnly<C extends AnyComponent, E>(
  loader: () => Promise<{ default: C }>,
  options?: DynamicOptions<E | EnvError>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return dynamic(BROWSER ? loader : rejected, options);
}
