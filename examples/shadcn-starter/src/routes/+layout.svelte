<script lang="ts">
 import { setThemeContext } from "@sjsf/shadcn-theme"
 import * as components from "@sjsf/shadcn-theme/new-york";

	import '../app.css';
	
	let { children } = $props();

	setThemeContext({ components })
</script>

{@render children()}
