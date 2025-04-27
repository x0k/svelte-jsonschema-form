<script lang="ts">
	import {
		getFormContext,
		inputAttributes,
		retrieveAttributes,
		type ComponentProps
	} from '@sjsf/form';
	import { multipleOptions, indexMapper } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/checkboxes.svelte';

	let {
		handlers,
		config,
		value = $bindable(),
		options,
		errors
	}: ComponentProps['checkboxesWidget'] = $props();

	const mapped = multipleOptions({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(
		retrieveAttributes(ctx, config, 'checkboxes', inputAttributes(handlers))
	);
</script>

{#each options as option, index (option.id)}
	<label class="fieldset-label">
		<input
			type="checkbox"
			class={['checkbox', errors.length > 0 && 'checkbox-error']}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		{option.label}
	</label>
{/each}
