<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	import { makeOptionsMapper } from './options.js';

	let { attributes, value = $bindable(), options, errors }: WidgetProps<'checkboxes'> = $props();

	const readonly = $derived(attributes.readonly);
	const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options));

	const guarder = {
		get value() {
			return value?.map(valueToIndex) ?? [];
		},
		set value(v) {
			if (readonly) {
				return;
			}
			value = v.map(indexToValue);
		}
	};
</script>

{#each options as option, index (option.value)}
	<label class="label cursor-pointer gap-2 justify-start">
    <input
    type="checkbox"
    class="checkbox checkbox-sm"
    class:checkbox-error={errors.length}
    bind:group={guarder.value}
    value={index}
    {...attributes}
    disabled={option.disabled || attributes.disabled}
		/>
		<span class="label-text">{option.label}</span>
	</label>
{/each}
