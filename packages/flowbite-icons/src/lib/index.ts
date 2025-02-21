import { fromRecord } from '@sjsf/form/lib/resolver';
import type { Icons } from '@sjsf/form';

import { arrowDownOutline, arrowUpOutline, fileCopyOutline, trashBinOutline } from './icons.svelte';

const icons: Partial<Icons> = {
	'move-array-item-up': arrowUpOutline,
	'move-array-item-down': arrowDownOutline,
	'remove-array-item': trashBinOutline,
	'copy-array-item': fileCopyOutline,
	'remove-object-property': trashBinOutline
};

export const iconsResolver = fromRecord(icons)
