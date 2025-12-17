<script lang="ts">
	import {
		type OperatorNode,
		detectApplicableOperators,
		isOperatorNode
	} from '$lib/builder/index.js';

	import { getBuilderContext } from '../../context.svelte.js';
	import { getNodeContext } from '../../node-context.js';
	import DropZone from '../../drop-zone.svelte';
	import RootNode from '../../root-node.svelte';
	import { getPredicateContext } from './context.js';

	interface Props {
		node: OperatorNode | undefined;
	}

	let { node = $bindable() }: Props = $props();

	const ctx = getBuilderContext();
	const nodeCtx = getNodeContext();
	const pCtx = getPredicateContext();
	const applicableOperators = $derived(detectApplicableOperators(pCtx.node, true));
</script>

{#if node}
	<RootNode
		showRequired={false}
		bind:node
		unmount={() => {
			node = undefined;
		}}
	/>
{:else}
	{@const droppable = ctx.createDroppable(nodeCtx, {
		accept: (node): node is OperatorNode =>
			isOperatorNode(node) && applicableOperators.has(node.op),
		onDrop(n) {
			node = n;
		}
	})}
	<DropZone {droppable}>
		{#snippet placeholder()}
			Drop operator here
		{/snippet}
	</DropZone>
{/if}
