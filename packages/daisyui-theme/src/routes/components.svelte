<script lang="ts">
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import Ajv from 'ajv';
	import { Form, type Theme, type Schema, type UiSchemaRoot } from '@sjsf/form';
	import { translation } from '@sjsf/form/translations/en';
	import { addFormComponents, AjvValidator, DEFAULT_AJV_CONFIG } from '@sjsf/ajv8-validator';

	const { theme, ...rest }: { theme: Theme } & HTMLFormAttributes = $props();

	const schema: Schema = {
		type: 'object',
		title: 'Title',
		description: 'description',
		properties: {
			array: {
				type: 'array',
				items: [
					{
						type: 'string'
					}
				],
				additionalItems: {
					type: 'number'
				}
			}
		},
		additionalProperties: {
			type: 'string'
		}
	};

	const uiSchema: UiSchemaRoot = {
		array: {
			items: {
				'ui:options': {
					help: 'test help'
				}
			}
		}
	};

	const errors = new SvelteMap([
		[
			'root',
			[
				{
					instanceId: 'root',
					error: null,
					message: 'test error',
					propertyTitle: 'Title'
				}
			]
		],
		[
			'root',
			[
				{
					instanceId: 'root',
					error: null,
					message: 'test error 2',
					propertyTitle: 'Title'
				}
			]
		]
	]);

	let value = $state({
		array: ['fixed', 123],
		additional: 'value'
	});

	const validator = new AjvValidator(addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)), uiSchema);
</script>

<Form {...rest} {...theme} {schema} {uiSchema} {validator} {translation} {errors} bind:value />
