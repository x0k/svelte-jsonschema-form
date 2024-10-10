<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { makeOptionsMapper } from './options.js';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'radio'> = $props();

	const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options));

	const readonly = $derived(attributes.readonly);

	const guarder = {
		get value() {
			return valueToIndex(value);
		},
		set value(v) {
			if (readonly) {
				return;
			}
			value = indexToValue(v);
		}
	};
</script>

{#each options as option, index (option.value)}
	<label class="label cursor-pointer gap-2">
		<input
			type="radio"
			class="radio radio-sm"
      class:radio-error={errors.length}
			bind:group={guarder.value}
			value={index}
			{...attributes}
			disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
