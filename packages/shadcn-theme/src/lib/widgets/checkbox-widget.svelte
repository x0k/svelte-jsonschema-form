<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { WidgetProps } from '@sjsf/form';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let { config, value = $bindable(), attributes }: WidgetProps<'checkbox'> = $props();

	const mapped = {
		get value() {
			return value ?? false;
		},
		set value(v) {
			value = v;
		}
	};
</script>

<div class="flex items-center space-x-2">
	<Checkbox bind:checked={mapped.value} {...attributes as ComponentProps<typeof Checkbox>} />
	<Label for={attributes.id}>
		{config.title}
	</Label>
</div>
