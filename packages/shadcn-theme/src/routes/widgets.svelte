<script lang="ts">
	import type { HTMLFormAttributes } from 'svelte/elements';

	import { Form, type Theme, type SchemaValue } from '@sjsf/form';
	import { translation } from '@sjsf/form/translations/en';

	import { errors, schema, uiSchema, validator } from './widgets';

	let {
		value = $bindable(),
		theme,
		...rest
	}: { theme: Theme; value: SchemaValue | undefined } & HTMLFormAttributes = $props();
</script>

<Form {...rest} {...theme} {schema} {uiSchema} {validator} {translation} {errors} bind:value />
