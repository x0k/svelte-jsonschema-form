<script lang="ts">
	import { Willow } from "@svar-ui/svelte-core";
	import { ComponentsAndWidgets } from 'theme-testing/demo';

	import { theme } from '../lib/index.js';
	import { specs } from '../lib/specs.js';
</script>

<Willow>
	<ComponentsAndWidgets {theme} {specs} />
</Willow>