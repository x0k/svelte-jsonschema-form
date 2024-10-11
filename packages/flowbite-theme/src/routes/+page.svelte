<script lang="ts">
	import '../app.css';
	import { theme } from '../lib/index.js';

	import WidgetsForm from './widgets.svelte';
	import ComponentsForm from './components.svelte';

	let value = $state({});
</script>

<div class="flex gap-8 p-8">
	<WidgetsForm bind:value class="flex flex-1 flex-col gap-4" {theme} />
	<div class="flex flex-1 flex-col gap-4">
		<ComponentsForm class="flex flex-col gap-4" {theme} />
		<pre><code>{JSON.stringify(value, null, 2)}</code></pre>
	</div>
</div>
