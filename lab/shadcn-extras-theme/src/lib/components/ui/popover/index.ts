import Root from '$lib/components/ui/popover/popover.svelte';
import Close from '$lib/components/ui/popover/popover-close.svelte';
import Content from '$lib/components/ui/popover/popover-content.svelte';
import Description from '$lib/components/ui/popover/popover-description.svelte';
import Header from '$lib/components/ui/popover/popover-header.svelte';
import Title from '$lib/components/ui/popover/popover-title.svelte';
import Trigger from '$lib/components/ui/popover/popover-trigger.svelte';
import Portal from '$lib/components/ui/popover/popover-portal.svelte';

export {
	Root,
	Content,
	Description,
	Header,
	Title,
	Trigger,
	Close,
	Portal,
	//
	Root as Popover,
	Content as PopoverContent,
	Description as PopoverDescription,
	Header as PopoverHeader,
	Title as PopoverTitle,
	Trigger as PopoverTrigger,
	Close as PopoverClose,
	Portal as PopoverPortal
};
