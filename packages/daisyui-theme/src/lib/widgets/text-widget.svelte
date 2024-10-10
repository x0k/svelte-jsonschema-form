<script lang="ts">
	import { type WidgetProps } from '@sjsf/form';

	import Datalist, { makeExamples } from './datalist.svelte';

	let { value = $bindable(), attributes, config }: WidgetProps<'text'> = $props();

	const examples = $derived(makeExamples(config, attributes));
</script>

<input type="text" bind:value class="input input-sm input-bordered grow" {...attributes} />
<Datalist {examples} />
