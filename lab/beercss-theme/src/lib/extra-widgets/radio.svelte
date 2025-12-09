<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import { idMapper, singleOption } from '@sjsf/form/options.svelte';
	import '@sjsf/basic-theme/extra-widgets/radio.svelte';

	let { config, handlers, value = $bindable(), options }: ComponentProps['radioWidget'] = $props();

	const mapped = singleOption({
		mapper: () => idMapper(options),
		value: () => value,
		update: (v) => (value = v)
	});

	const ctx = getFormContext();

	const attributes = $derived(inputAttributes(ctx, config, 'radio', handlers, { type: 'radio' }));
</script>

<nav>
	{#each options as option (option.id)}
		<label class="radio">
			<input
				{...attributes}
				bind:group={mapped.current}
				value={option.id}
				id={option.id}
				disabled={option.disabled || attributes.disabled}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
</nav>
