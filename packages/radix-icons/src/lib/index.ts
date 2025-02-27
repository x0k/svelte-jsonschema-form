import { fromRecord } from '@sjsf/form/lib/resolver';
import type { Icons } from '@sjsf/form';

import { arrowDownOutline, arrowUpOutline, fileCopyOutline, trashBinOutline } from './icons.svelte';

const icons = {
	'move-array-item-up': arrowUpOutline,
	'move-array-item-down': arrowDownOutline,
	'remove-array-item': trashBinOutline,
	'copy-array-item': fileCopyOutline,
	'remove-object-property': trashBinOutline
} satisfies Partial<Icons>;

export const iconsResolver = fromRecord(icons);
