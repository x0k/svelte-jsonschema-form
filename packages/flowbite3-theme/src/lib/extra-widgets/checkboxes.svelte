<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte';
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbiteCheckboxes?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { multipleOptions, indexMapper } from '@sjsf/form/options.svelte';
	import Checkbox from 'flowbite-svelte/Checkbox.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
	const indexes = $derived(new Set(mapped.value));

	const ctx = getFormContext();

	const attributes = $derived(
		inputAttributes(
			ctx,
			config,
			handlers,
			config.uiOptions?.flowbiteCheckboxes,
			ctx.extraUiOptions?.('flowbiteCheckboxes', config)
		)
	);
</script>

{#each options as option, index (option.id)}
	<Checkbox
		bind:checked={
			() => indexes.has(index),
			(v) => {
				if (v) {
					mapped.value = Array.from(indexes.add(index));
				} else {
					indexes.delete(index);
					mapped.value = Array.from(indexes);
				}
			}
		}
		{...attributes}
		id={option.id}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Checkbox>
{/each}
