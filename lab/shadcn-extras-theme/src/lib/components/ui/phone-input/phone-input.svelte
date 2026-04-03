<script lang="ts" module>
	export const defaultOptions: TelInputOptions = {
		spaces: true,
		autoPlaceholder: true
	};
</script>

<script lang="ts">
	import CountrySelector from '$lib/components/ui/phone-input/country-selector.svelte';
	import { type PhoneInputProps } from '$lib/components/ui/phone-input/index.js';
	import { cn } from '$lib/utils.js';
	import { TelInput, countries } from 'svelte-tel-input';
	import 'svelte-tel-input/styles/flags.css';
	import type { TelInputOptions } from 'svelte-tel-input/types';

	let {
		class: className = undefined,
		defaultCountry = null,
		country = $bindable(defaultCountry),
		options = defaultOptions,
		placeholder,
		readonly = false,
		disabled = false,
		value = $bindable(''),
		valid = $bindable(true),
		detailedValue = $bindable(null),
		order = undefined,
		name = undefined,
		...rest
	}: PhoneInputProps = $props();

	let el: HTMLInputElement | undefined = $state();

	function focus() {
		// sort of an after update kinda thing
		setTimeout(() => {
			el?.focus();
		}, 0);
	}
</script>

<div class="flex place-items-center">
	<CountrySelector {order} {countries} bind:selected={country} onselect={focus} />
	<TelInput
		{name}
		bind:country
		bind:detailedValue
		bind:value
		bind:valid
		{readonly}
		{disabled}
		{placeholder}
		bind:el
		{options}
		class={cn(
			'border-l-none flex h-9 w-full min-w-0 rounded-l-none rounded-r-md border-y border-r border-input bg-background px-3 py-1 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
			'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
			'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
			className
		)}
		{...rest}
	/>
</div>
