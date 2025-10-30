<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import {
		Command,
		CommandInput,
		CommandList,
		CommandItem,
		CommandGroup
	} from '@sjsf/shadcn4-theme/new-york';
	import { parseDate } from 'yeezy-dates';
	import type { NLPDateInputProps } from './types.js';

	let {
		placeholder = 'E.g. "tomorrow at 5pm" or "in 2 hours"',
		min,
		max,
		onChoice
	}: NLPDateInputProps = $props();

	let value = $state('');

	const suggestions = $derived(
		parseDate(value).filter(
			(suggestion) =>
				(min === undefined || suggestion.date > min) && (max === undefined || suggestion.date < max)
		)
	);
</script>

<Command shouldFilter={false} class="h-fit border border-border">
	<CommandInput {placeholder} bind:value />
	<CommandList>
		<CommandGroup>
			{#each suggestions as suggestion (suggestion)}
				<CommandItem
					onSelect={() => {
						onChoice?.(suggestion);
					}}
				>
					<div class="flex w-full place-items-center justify-between">
						<span>
							{suggestion.label}
						</span>
						<span class="text-muted-foreground">
							{suggestion.date.toDateString()}
							{suggestion.date.toLocaleTimeString()}
						</span>
					</div>
				</CommandItem>
			{/each}
		</CommandGroup>
	</CommandList>
</Command>
