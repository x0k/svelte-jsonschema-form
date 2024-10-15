<script lang="ts">
	import '../app.css';
	import { theme } from '../lib/index.js';

	import WidgetsForm from './widgets.svelte';
  import ComponentsForm from './components.svelte';
</script>

<div class="flex gap-8 p-8">
	<WidgetsForm class="flex flex-1 flex-col gap-4 light" {theme} />
	<ComponentsForm class="flex flex-1 flex-col gap-4" {theme} />
</div>
