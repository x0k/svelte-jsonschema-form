import { BROWSER } from 'esm-env'

import type { AnyComponent } from './svelte.svelte.js';
import { dynamic, type DynamicOptions } from './dynamic.svelte'

export class EnvError {}

const REJECTED = Promise.reject(new EnvError())

const rejected = () => REJECTED

export function clientOnly<C extends AnyComponent, E>(
  loader: () => Promise<{ default: C }>,
  options?: DynamicOptions<E | EnvError>
) {
  return dynamic(BROWSER ? loader : rejected, options)
}
