import { asSnippet, type Icons } from '@sjsf/form';
import ArrowUpOutline from 'flowbite-svelte-icons/ArrowUpOutline.svelte'
import ArrowDownOutline from 'flowbite-svelte-icons/ArrowDownOutline.svelte'
import TrashBinOutline from 'flowbite-svelte-icons/TrashBinOutline.svelte'
import FileCopyOutline from 'flowbite-svelte-icons/FileCopyOutline.svelte'

export const icons: Icons = {
	"move-array-item-up": asSnippet(ArrowUpOutline),
	"move-array-item-down": asSnippet(ArrowDownOutline),
	"remove-array-item": asSnippet(TrashBinOutline),
	"copy-array-item": asSnippet(FileCopyOutline),
	"remove-object-property": asSnippet(TrashBinOutline),
}
