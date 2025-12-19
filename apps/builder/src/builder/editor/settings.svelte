<script lang="ts">
	import CircleX from '@lucide/svelte/icons/circle-x';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';

	import { isCustomizableNode } from '$lib/builder/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CopyButton } from '$lib/components/copy-button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { THEME_TITLES, THEMES } from '$lib/sjsf/theme.js';
	import Select from '$lib/components/select.svelte';
	import { encodeJson } from '$lib/url.js';

	import { PreviewSubRouteName, RouteName } from '../model.js';
	import { getBuilderContext } from '../context.svelte.js';
	import Container from '../container.svelte';

	import NodeSettings from './node-settings.svelte';

	const ctx = getBuilderContext();
	const uniqueId = $props.id();
	const selected = $derived(ctx.selectedNode);
</script>

<Container class="mb-4 flex flex-col gap-4 p-3">
	<div class="text-md py-2 font-medium">Form options</div>
	<div class="flex flex-col gap-1.5">
		<Label for={`${uniqueId}-theme`}>Theme</Label>
		<Select
			class="w-full"
			labelId="{uniqueId}-theme"
			bind:value={ctx.theme}
			items={THEMES}
			labels={THEME_TITLES}
		/>
	</div>
	<div class="flex items-center gap-2">
		<Checkbox id={`${uniqueId}-live`} bind:checked={ctx.livePreview} />
		<Label class="text-base" for={`${uniqueId}-live`}>Live preview</Label>
	</div>
	<div class="flex items-center gap-2">
		<Checkbox id={`${uniqueId}-ignore`} bind:checked={ctx.ignoreWarnings} />
		<Label class="text-base" for={`${uniqueId}-ignore`}>Ignore warnings</Label>
	</div>
	<Button
		disabled={ctx.rootNode === undefined}
		onclick={() => {
			if (ctx.validate()) {
				ctx.build();
				ctx.route = { name: RouteName.Preview, subRoute: PreviewSubRouteName.Code };
			}
		}}
	>
		Build
	</Button>
	{#if ctx.errorsCount || ctx.warningsCount}
		<div class="flex flex-wrap items-center justify-start gap-4">
			{#if ctx.errorsCount}
				<div class="flex items-center gap-2">
					<CircleX class="text-destructive" />
					{ctx.errorsCount} error{ctx.errorsCount > 1 ? 's' : ''}
				</div>
			{/if}
			{#if ctx.warningsCount}
				<div class="flex items-center gap-2">
					<CircleAlert class="text-chart-3" />
					{ctx.warningsCount} warning{ctx.warningsCount > 1 ? 's' : ''}
				</div>
			{/if}
		</div>
	{/if}
	<CopyButton
		text={() => {
			const url = new URL(window.location.href);
			url.search = '';
			url.hash = encodeJson(ctx.exportState());
			return url.toString();
		}}>Share</CopyButton
	>
</Container>
{#if selected && isCustomizableNode(selected)}
	<Container class="p-3">
		<NodeSettings bind:node={() => selected, (n) => ctx.updateSelectedNode(n)} />
	</Container>
{/if}
