<script lang="ts">
	import { ComponentsAndWidgets } from 'testing/demo';

	import { theme, setThemeContext, type ThemeComponents } from '../lib/theme/index.js';

	const { components }: { components: ThemeComponents } = $props();

	setThemeContext({ components });
</script>

<ComponentsAndWidgets {theme} />
