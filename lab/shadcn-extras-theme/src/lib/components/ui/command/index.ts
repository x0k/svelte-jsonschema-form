import { Command as CommandPrimitive } from 'bits-ui';

import Root from '$lib/components/ui/command/command.svelte';
import Dialog from '$lib/components/ui/command/command-dialog.svelte';
import Empty from '$lib/components/ui/command/command-empty.svelte';
import Group from '$lib/components/ui/command/command-group.svelte';
import Item from '$lib/components/ui/command/command-item.svelte';
import Input from '$lib/components/ui/command/command-input.svelte';
import List from '$lib/components/ui/command/command-list.svelte';
import Separator from '$lib/components/ui/command/command-separator.svelte';
import Shortcut from '$lib/components/ui/command/command-shortcut.svelte';
import LinkItem from '$lib/components/ui/command/command-link-item.svelte';

const Loading = CommandPrimitive.Loading;

export {
	Root,
	Dialog,
	Empty,
	Group,
	Item,
	LinkItem,
	Input,
	List,
	Separator,
	Shortcut,
	Loading,
	//
	Root as Command,
	Dialog as CommandDialog,
	Empty as CommandEmpty,
	Group as CommandGroup,
	Item as CommandItem,
	LinkItem as CommandLinkItem,
	Input as CommandInput,
	List as CommandList,
	Separator as CommandSeparator,
	Shortcut as CommandShortcut,
	Loading as CommandLoading
};
