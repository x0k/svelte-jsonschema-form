<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';
	import Input, { type InputProps } from 'flowbite-svelte/Input.svelte';
	import Datepicker, { type DatepickerProps } from 'flowbite-svelte/Datepicker.svelte';

	let { value = $bindable(), attributes }: WidgetProps<'text'> = $props();

	const date = {
		get value() {
			return value ? new Date(value) : null;
		},
		set value(v) {
			if (attributes.readonly) {
				return;
			}
			if (!v) {
				value = undefined;
				return;
			}
			value = v.toLocaleDateString('en-CA');
		}
	};
</script>

{#if attributes.type === 'date'}
	<div class="w-full">
		<Datepicker
			bind:value={date.value}
			showActionButtons
			autohide={false}
			{...attributes as DatepickerProps}
		/>
	</div>
{:else}
	<Input type="text" bind:value {...attributes as InputProps} />
{/if}
