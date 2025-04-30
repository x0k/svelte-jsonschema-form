<script lang="ts" module>
	import type { SelectProps } from 'flowbite-svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Select?: SelectProps<number>;
		}
	}
</script>

<script lang="ts">
	import {
		getFormContext,
		retrieveInputAttributes,
		selectAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import { singleOption, indexMapper } from '@sjsf/form/options.svelte';
	import Select from 'flowbite-svelte/Select.svelte';

	let { handlers, value = $bindable(), options, config }: ComponentProps['selectWidget'] = $props();

	const mapped = $derived(
		singleOption({
			mapper: () => indexMapper(options),
			value: () => value,
			update: (v) => (value = v)
		})
	);

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveInputAttributes(ctx, config, 'flowbite3Select', selectAttributes(handlers))
	);
</script>

<Select bind:value={mapped.value} placeholder="" {...attributes}>
	{#if config.schema.default === undefined}
		<option value={-1}>{attributes.placeholder}</option>
	{/if}
	{#each options as option, index (option.id)}
		<option value={index} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</Select>
