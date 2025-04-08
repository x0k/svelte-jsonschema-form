<script lang="ts" module>
	import type { SelectProps } from 'flowbite-svelte/Select.svelte';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteSelect?: SelectProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, selectAttributes, type ComponentProps } from '@sjsf/form';
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
		selectAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteSelect,
			ctx.extraUiOptions?.('flowbiteSelect', config)
		)
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
