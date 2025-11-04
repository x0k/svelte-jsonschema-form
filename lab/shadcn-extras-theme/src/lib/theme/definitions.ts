import type { ComponentDefinitions } from '@sjsf/form';

export interface ExtraWidgets {}

export const definitions = {} satisfies Partial<ComponentDefinitions> as Pick<
	ComponentDefinitions,
	keyof ExtraWidgets
>;
