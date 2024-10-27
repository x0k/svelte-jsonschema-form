<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';

	import { Input } from '$lib/components/ui/input';
	// import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	// import { Button } from '$lib/components/ui/button';
	// import { cn } from '$lib/utils';
	// import Calendar from '$lib/components/ui/calendar/calendar.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();

	// const date = $derived(new Date(value ?? 'invalid'));
	// const isValid = $derived(!isNaN(date as unknown as number));
	// const dateFormatOptions: Intl.DateTimeFormatOptions = {
	// 	year: 'numeric',
	// 	month: 'long',
	// 	day: 'numeric'
	// };
	// const formattedValue = $derived(
	// 	isValid
	// 		? new Intl.DateTimeFormat(undefined, dateFormatOptions).format(date)
	// 		: (attributes.placeholder ?? value)
	// );
</script>

<!-- {#if attributes.type === 'date'}
	<Popover>
		<PopoverTrigger>
			{#snippet child({ props })}
				<Button {...props} class={cn(!isValid && 'text-muted-foreground')}>
					{formattedValue}
				</Button>
			{/snippet}
		</PopoverTrigger>
		<PopoverContent>
			<Calendar bind:value initialFocus />
		</PopoverContent>
	</Popover>
{:else} -->
	<Input type="text" bind:value {...attributes} />
<!-- {/if} -->
