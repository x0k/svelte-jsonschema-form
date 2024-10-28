<script lang="ts">
	import { components as defaultComponents } from '../lib/default-ui';
	import { components as newYorkComponents } from '../lib/new-york-ui';

	import Page from './page.svelte';

	const components = {
		default: defaultComponents,
		'new-york': newYorkComponents
	};

	let componentsName = $state<keyof typeof components>('default');
</script>

<select bind:value={componentsName}>
	<option value="default">Default</option>
	<option value="new-york">NewYork</option>
</select>
{#key componentsName}
	<Page components={components[componentsName]} />
{/key}
