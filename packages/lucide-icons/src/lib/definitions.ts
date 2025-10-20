import type { IconDefinitions } from '@sjsf/form';

import { arrowDownOutline, arrowUpOutline, fileCopyOutline, trashBinOutline } from './icons.svelte';

export interface ExtraIcons {}

const icons = {
	'move-array-item-up': arrowUpOutline,
	'move-array-item-down': arrowDownOutline,
	'remove-array-item': trashBinOutline,
	'copy-array-item': fileCopyOutline,
	'remove-object-property': trashBinOutline
} satisfies Partial<IconDefinitions>;

export const definitions = icons as typeof icons & Pick<IconDefinitions, keyof ExtraIcons>;
