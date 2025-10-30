<script lang="ts">
	import { setThemeContext } from '@sjsf/shadcn4-theme';
	import { ComponentsAndWidgets } from 'theme-testing/demo';
	import * as components from '@sjsf/shadcn4-theme/new-york';

	import '../app.css';
	import { specs } from '../lib/specs.js';
	import * as extraComponents from '../lib/components/ui/index.js';
	import { theme } from '../lib/theme/index.js'

	setThemeContext({ components: { ...components, ...extraComponents } });
</script>

<ComponentsAndWidgets {theme} {specs} />
