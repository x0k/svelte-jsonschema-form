import { SvelteMap } from 'svelte/reactivity';

import type { ValidationError } from '@/core/index.js';

export type Errors<T = unknown> = SvelteMap<string, ValidationError<T>[]>;

export const NO_ERRORS: ValidationError<unknown>[] = [];
