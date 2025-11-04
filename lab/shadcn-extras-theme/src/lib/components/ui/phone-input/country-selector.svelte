<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
		Command,
		CommandInput,
		CommandList,
		CommandEmpty,
		CommandGroup,
		CommandItem
	} from '@sjsf/shadcn4-theme/new-york';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { cn } from '$lib/utils/utils.js';
	import Flag from './flag.svelte';
	import type { Country, CountryCode } from 'svelte-tel-input/types';

	interface Props {
		/** List of countries */
		countries: Country[];
		disabled?: boolean;
		selected?: CountryCode | null;
		onselect?: (val: CountryCode | null) => void;
		/** Default ordering is alphabetical by country name supply this function to customize the sorting behavior  */
		order?: (a: Country, b: Country) => number;
	}

	let {
		countries,
		disabled = false,
		selected = $bindable(null),
		onselect = undefined,
		order = (a, b) => {
			return a.name.localeCompare(b.name);
		}
	}: Props = $props();

	let selectedCountry = $derived(countries.find((a) => a.iso2 == selected));

	let open = $state(false);
	let selectedValue = $state(false);

	const selectCountry = (country: Country) => {
		selected = country.iso2;
		selectedValue = true;
		open = false;
		onselect?.(selected);
	};
</script>

<Popover bind:open>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				type="button"
				variant="outline"
				class={cn('flex shrink-0 gap-1 rounded-l-lg rounded-r-none px-3')}
				{disabled}
			>
				<Flag country={selectedCountry} />
				<ChevronsUpDownIcon
					class={cn('-mr-2 h-4 w-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
				/>
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent
		class="w-[300px] p-0"
		onCloseAutoFocus={(e) => {
			if (selectedValue) {
				selectedValue = false;
				e.preventDefault();
			}
		}}
	>
		<Command>
			<CommandInput placeholder="Search country..." />
			<CommandList>
				<ScrollArea class="h-72">
					<CommandEmpty>No country found.</CommandEmpty>
					<CommandGroup>
						{#each countries.sort(order) as country (country.id)}
							<CommandItem
								class="gap-2"
								value={country.name}
								onSelect={() => selectCountry(country)}
							>
								<Flag {country} />
								<span class="flex-1 text-sm">{country.name}</span>
								<span class="text-sm text-foreground/50">
									+{country.dialCode}
								</span>
								<div class="w-4">
									{#if country.iso2 == selected}
										<CheckIcon class="size-4" />
									{/if}
								</div>
							</CommandItem>
						{/each}
					</CommandGroup>
				</ScrollArea>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
