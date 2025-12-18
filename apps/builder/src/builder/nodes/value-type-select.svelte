<script lang="ts" generics="T extends string">
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const selectId = $props.id();

	interface Props {
		value: T;
		items: T[],
		labels: Record<T, string>
	}

	let { value = $bindable(), items, labels }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<Label class="text-base text-muted-foreground" for={selectId}>Value type</Label>
	<Select.Root type="single" bind:value>
		<Select.Trigger id={selectId} size="sm">
			{labels[value]}
		</Select.Trigger>
		<Select.Content>
			{#each items as t (t)}
				<Select.Item value={t}>{labels[t]}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
