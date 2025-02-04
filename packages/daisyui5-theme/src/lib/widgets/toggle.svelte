<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WidgetCommonProps } from '@sjsf/form';

	declare module '@sjsf/form' {
		interface WidgetsAndProps<V> {
			toggle: WidgetCommonProps<V, HTMLInputAttributes>;
		}

		interface WidgetValue {
			toggle: boolean;
		}
	}
</script>

<script lang="ts">
	import type { WidgetProps } from '@sjsf/form';

	let { config, value = $bindable(), attributes, errors }: WidgetProps<'toggle'> = $props();
</script>

<label class="fieldset-label">
	<input
		type="checkbox"
		class={['toggle', errors.length > 0 && 'toggle-error']}
		bind:checked={value}
		{...attributes}
	/>
	{config.title}
</label>
