<script lang="ts">
	import { ComponentsAndWidgets } from 'theme-testing/demo';
	import 'beercss';
	import 'material-dynamic-colors';

	import { theme } from '../lib/index.js';
	import { specs } from '../lib/specs.js';
</script>

<ComponentsAndWidgets {theme} {specs} />
