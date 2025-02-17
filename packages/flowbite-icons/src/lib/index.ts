import type { Icons } from '@sjsf/form';

import { arrowDownOutline, arrowUpOutline, fileCopyOutline, trashBinOutline } from './icons.svelte';

export const icons: Icons = {
	'move-array-item-up': arrowUpOutline,
	'move-array-item-down': arrowDownOutline,
	'remove-array-item': trashBinOutline,
	'copy-array-item': fileCopyOutline,
	'remove-object-property': trashBinOutline
};
