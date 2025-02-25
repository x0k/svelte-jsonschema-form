<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { indexMapper, singleOption } from '@sjsf/form/options.svelte';

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

	const attributes = $derived(inputAttributes(ctx, config, handlers, config.uiOptions?.radio));
</script>

{#each options as option, index (option.id)}
	<label class="label cursor-pointer gap-2">
		<input
			type="radio"
			class={['radio', errors.length > 0 && 'radio-error']}
			bind:group={mapped.value}
			value={index}
			{...attributes}
			id={option.id}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
