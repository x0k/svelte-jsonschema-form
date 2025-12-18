<script lang="ts">
	import {
		createRangeNode,
		RANGE_VALUE_TYPE_TITLES,
		RANGE_VALUE_TYPES,
		type NodeType
	} from '$lib/builder/index.js';

	import type { NodeProps } from '../model.js';
	import NodeContainer from '../node-container.svelte';
	import NodeHeader from '../customizable-node-header.svelte';
	import NodeIssues from '../node-issues.svelte';
	import { getBuilderContext } from '../context.svelte.js';

	import ValueTypeSelect from './value-type-select.svelte';

	let {
		node = $bindable(),
		draggable,
		unmount,
		showRequired
	}: NodeProps<NodeType.Range> = $props();

	const ctx = getBuilderContext()
</script>

<NodeContainer bind:node {draggable} {showRequired} class="flex flex-col gap-0.5">
	<NodeHeader {node} {draggable} {unmount} {showRequired} disablePadding>
		{#snippet append()}
			<ValueTypeSelect
				bind:value={
					() => node.valueType,
					(t) => {
						node = createRangeNode(node.id, t, node.options);
					}
				}
				items={ctx.availableRangeValueTypes}
				labels={RANGE_VALUE_TYPE_TITLES}
			/>
		{/snippet}
	</NodeHeader>
	<NodeIssues {node} />
</NodeContainer>
