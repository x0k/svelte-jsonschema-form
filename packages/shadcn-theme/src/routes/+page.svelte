<script lang="ts">
	import { components as defaultComponents } from '../lib/default-ui';
	import { components as newYorkComponents } from '../lib/new-york-ui';

	import Content from './content.svelte';
	import '../app.css';

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
	<Content components={components[componentsName]} />
{/key}
