<script lang="ts" module>
	import type { CheckboxProps } from 'flowbite-svelte/types';
	import '@sjsf/form/fields/extra-widgets/checkboxes';

	declare module '@sjsf/form' {
		interface UiOptions {
			flowbite3Checkboxes?: CheckboxProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { idMapper, multipleOptions } from '@sjsf/form/options.svelte';
	import Checkbox from 'flowbite-svelte/Checkbox.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});
	const selected = $derived(new Set(mapped.current));

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'flowbite3Checkboxes', handlers, {}));
</script>

{#each options as option (option.id)}
	<Checkbox
		bind:checked={
			() => selected.has(option.id),
			(v) => {
				mapped.current = v
					? mapped.current.concat(option.id)
					: mapped.current.filter((id) => id !== option.id);
			}
		}
		{...attributes}
		id={option.id}
		disabled={option.disabled || attributes.disabled}
	>
		{option.label}
	</Checkbox>
{/each}
