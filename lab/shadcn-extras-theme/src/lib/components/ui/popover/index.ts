import { Popover as PopoverPrimitive } from 'bits-ui';
import Content from '$lib/components/ui/popover/popover-content.svelte';
import Trigger from '$lib/components/ui/popover/popover-trigger.svelte';
const Root = PopoverPrimitive.Root;
const Close = PopoverPrimitive.Close;

export {
	Root,
	Content,
	Trigger,
	Close,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	Close as PopoverClose
};
