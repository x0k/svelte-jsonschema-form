<script lang="ts" module>
	import type { PikadayOptions } from 'pikaday';

	declare module '@sjsf/form' {
		interface WidgetsAndProps<V> {
			pikadayCalendar: WidgetCommonProps<V, HTMLInputAttributes>;
		}

		interface WidgetValue {
			pikadayCalendar: string;
		}

		interface UiOptions {
			pikaday?: PikadayOptions;
		}
	}
</script>

<script lang="ts">
	import type { WidgetCommonProps, WidgetProps } from '@sjsf/form';
	import Pikaday from 'pikaday';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), attributes, errors, config }: WidgetProps<'text'> = $props();

	let input: HTMLInputElement | undefined;
	$effect(() => {
		if (!input) {
			return;
		}
		const format = new Intl.DateTimeFormat('en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const picker = new Pikaday({
			...config.uiOptions?.pikaday,
			field: input,
			onSelect(date) {
				value = format.format(date);
			}
		});
		return () => picker.destroy();
	});
</script>

<input
	type="text"
	{value}
	class={['input pika-single w-full', errors.length > 0 && 'input-error']}
	bind:this={input}
	{...attributes}
/>
