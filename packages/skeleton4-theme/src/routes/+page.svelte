<script lang="ts">
	import { ComponentsAndWidgets } from 'theme-testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
	import { specs } from '../lib/specs.js';
</script>

<ComponentsAndWidgets {theme} {specs} />
