<script lang="ts">
	import { ComponentsAndWidgets } from 'testing/demo';

	import { theme, setThemeContext, type ThemeComponents } from '../lib/theme/index.js';
	import { specs } from '../lib/specs';

	const { components }: { components: ThemeComponents } = $props();

	setThemeContext({ components });
</script>

<ComponentsAndWidgets {theme} additionalSpecs={specs} />
