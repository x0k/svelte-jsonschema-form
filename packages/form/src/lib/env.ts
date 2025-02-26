import type { Component } from 'svelte';
import { BROWSER } from 'esm-env'

import { dynamic, type DynamicOptions } from './dynamic.svelte'

export class EnvError {}

const REJECTED = Promise.reject(new EnvError())

const rejected = () => REJECTED

export function clientOnly<C extends Component<any, any, any>, E>(
  loader: () => Promise<{ default: C }>,
  options?: DynamicOptions<E | EnvError>
) {
  return dynamic(BROWSER ? loader : rejected, options)
}
