<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/radio.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options,
		errors
	}: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'radio', handlers, { type: 'radio' }));
</script>

{#each options as option (option.id)}
	<label class="fieldset-label">
		<input
			class={['radio', errors.length > 0 && 'radio-error']}
			bind:group={mapped.value}
			value={option.id}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		{option.label}
	</label>
{/each}
