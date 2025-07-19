<script lang="ts">
	import { ComponentsAndWidgets } from 'testing/demo';

	import '../app.css';
	import { setThemeContext, theme } from '../lib/theme/index.js';
	import { specs } from '../lib/specs.js';
	import * as components from '../lib/components/ui/index.js';

	setThemeContext({ components });
</script>

<ComponentsAndWidgets {theme} additionalSpecs={specs} />
