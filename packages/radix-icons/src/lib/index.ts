import { asSnippet, type Icons } from '@sjsf/form';
import ArrowUp from 'svelte-radix/ArrowUp.svelte';
import ArrowDown from 'svelte-radix/ArrowDown.svelte';
import Trash from 'svelte-radix/Trash.svelte';
import Copy from 'svelte-radix/Copy.svelte';

export const icons: Icons = {
	'move-array-item-up': asSnippet(ArrowUp, { size: '20' }),
	'move-array-item-down': asSnippet(ArrowDown, { size: '20' }),
	'remove-array-item': asSnippet(Trash, { size: '20' }),
	'copy-array-item': asSnippet(Copy, { size: '20' }),
	'remove-object-property': asSnippet(Trash, { size: '20' })
};
