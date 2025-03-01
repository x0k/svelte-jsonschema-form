<script lang="ts">
	import { ComponentsAndWidgets } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
	import '../lib/extra-widgets/multi-select-include';
	import '../lib/extra-widgets/textarea-include';
	import '../lib/extra-widgets/switch-include';
	import '../lib/extra-widgets/date-picker-include';
	import '../lib/extra-widgets/range-include';
	import '../lib/extra-widgets/radio-buttons-include';
</script>

<ComponentsAndWidgets {theme} />
