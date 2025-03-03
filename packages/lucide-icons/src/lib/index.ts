import { fromRecord } from '@sjsf/form/lib/resolver';
import type { IconDefinitions } from '@sjsf/form';

import { arrowDownOutline, arrowUpOutline, fileCopyOutline, trashBinOutline } from './icons.svelte';

const definitions = {
	'move-array-item-up': arrowUpOutline,
	'move-array-item-down': arrowDownOutline,
	'remove-array-item': trashBinOutline,
	'copy-array-item': fileCopyOutline,
	'remove-object-property': trashBinOutline
} satisfies Partial<IconDefinitions>;

export const icons = fromRecord(definitions);
