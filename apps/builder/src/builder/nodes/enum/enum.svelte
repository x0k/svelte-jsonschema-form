<script lang="ts">
	import { ENUM_VALUE_TYPE_TITLES, ENUM_VALUE_TYPES, type NodeType } from '$lib/builder/index.js';

	import type { NodeProps } from '../../model.js';
	import NodeContainer from '../../node-container.svelte';
	import NodeHeader from '../../customizable-node-header.svelte';
	import NodeIssues from '../../node-issues.svelte';

	import ValueTypeSelect from '../value-type-select.svelte';

	import EnumItems from './enum-items.svelte';

	let {
		node = $bindable(),
		draggable,
		unmount,
		showRequired
	}: NodeProps<NodeType.Enum> | NodeProps<NodeType.MultiEnum> = $props();
</script>

<NodeContainer bind:node {draggable} {showRequired} class="flex flex-col gap-0.5">
	<NodeHeader {node} {draggable} {unmount} {showRequired}>
		{#snippet append()}
			<ValueTypeSelect
				bind:value={node.valueType}
				items={ENUM_VALUE_TYPES}
				labels={ENUM_VALUE_TYPE_TITLES}
			/>
		{/snippet}
	</NodeHeader>
	<EnumItems bind:items={node.items} valueType={node.valueType} />
	<NodeIssues {node} />
</NodeContainer>
