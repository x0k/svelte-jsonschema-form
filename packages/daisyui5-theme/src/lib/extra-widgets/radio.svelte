<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/radio.svelte';

	let {
		config,
		handlers,
		value = $bindable(),
		options,
		errors
	}: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => indexMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes('radio', handlers)({ type: 'radio' }, config, ctx));
</script>

{#each options as option, index (option.id)}
	<label class="fieldset-label">
		<input
			class={['radio', errors.length > 0 && 'radio-error']}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		{option.label}
	</label>
{/each}
