<script lang="ts">
	import type { SchemaValue } from '@sjsf/form';

	import '../app.css';
	import { theme, setThemeContext } from '../lib/theme/index.js';
	import { components } from '../lib/default-ui'

	import WidgetsForm from './widgets.svelte';
  import ComponentsForm from './components.svelte';

	let widgetsValue: SchemaValue | undefined = $state()

	let componentsValue = $state({
		array: ['fixed', 123],
		additional: 'value'
	});

	setThemeContext({ components })
</script>

{#snippet formData(value: SchemaValue | undefined)}
	<div class="max-h-[40vh] overflow-y-auto sticky top-0 bg-white dark:bg-slate-900 z-50 border-b py-2">
		<pre><code>{JSON.stringify(value, null, 2)}</code></pre>
	</div>
{/snippet}

<div class="flex gap-8 p-8">
	<div class="flex flex-1 flex-col gap-4 light">
		{@render formData(widgetsValue)}
		<WidgetsForm bind:value={widgetsValue} {theme} />
	</div>
	<div class="flex flex-1 flex-col gap-4">
		{@render formData(componentsValue)}
		<ComponentsForm bind:value={componentsValue} {theme} />
	</div>
</div>
