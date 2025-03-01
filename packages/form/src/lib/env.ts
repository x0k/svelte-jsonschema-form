import { BROWSER } from 'esm-env'

import type { AnyComponent } from './svelte.svelte.js';
import { dynamic, type DynamicOptions } from './dynamic.svelte'

export class EnvError {}

const rejected = () => Promise.reject(new EnvError())

export function clientOnly<C extends AnyComponent, E>(
  loader: () => Promise<{ default: C }>,
  options?: DynamicOptions<E | EnvError>
) {
  return dynamic(BROWSER ? loader : rejected, options)
}
