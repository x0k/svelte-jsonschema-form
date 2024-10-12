<script lang="ts">
	import type { HTMLFormAttributes } from 'svelte/elements';
	import Ajv from 'ajv';
	import {
		Form,
		type Theme,
		type Schema,
		type UiSchema,
		type UiSchemaRoot,
		type ValidationError
	} from '@sjsf/form';
	import { translation } from '@sjsf/form/translations/en';
	import { addFormComponents, AjvValidator, DEFAULT_AJV_CONFIG } from '@sjsf/ajv8-validator';
	import { SvelteMap } from 'svelte/reactivity';

	const { theme, ...rest }: { theme: Theme } & HTMLFormAttributes = $props();

	const states = (schema: Schema): Schema => ({
		type: 'object',
		properties: {
			default: schema,
			disabled: schema,
			readonly: schema,
			error: schema
		}
	});

	const boolean: Schema = {
		type: 'boolean'
	};

	const enumeration: Schema = {
		type: 'string',
		enum: ['foo', 'bar', 'fuzz', 'qux']
	};

	const uniqueArray: Schema = {
		type: 'array',
		items: enumeration,
		uniqueItems: true
	};

	const file: Schema = {
		type: 'string',
		format: 'data-url'
	};

	const text: Schema = {
		type: 'string'
	};

	const schema: Schema = {
		type: 'object',
		properties: {
			checkbox: states(boolean),
			checkboxes: states(uniqueArray),
			file: states(file),
			multiFile: states({
				type: 'array',
				items: file
			}),
			number: states({
				type: 'number'
			}),
			radio: states(enumeration),
			select: states(enumeration),
			multiSelect: states(uniqueArray),
			text: states(text),
			textarea: states(text),
			toggle: states(boolean)
		}
	};

	const uiStates = (uiSchema: UiSchema): UiSchema => ({
		default: uiSchema,
		disabled: {
			...uiSchema,
			'ui:options': {
				...uiSchema['ui:options'],
				input: {
					...uiSchema['ui:options']?.input,
					disabled: true
				}
			}
		},
		readonly: {
			...uiSchema,
			'ui:options': {
				...uiSchema['ui:options'],
				input: {
					...uiSchema['ui:options']?.input,
					readonly: true
				}
			}
		},
		error: uiSchema
	});

	const uiSchema: UiSchemaRoot = {
		checkbox: uiStates({}),
		checkboxes: uiStates({
			'ui:widget': 'checkboxes'
		}),
		file: uiStates({}),
		multiFile: uiStates({}),
		number: uiStates({}),
		radio: uiStates({
			'ui:widget': 'radio'
		}),
		select: uiStates({}),
		multiSelect: uiStates({}),
		text: uiStates({}),
		textarea: uiStates({
			'ui:widget': 'textarea'
		}),
		toggle: uiStates({
			'ui:widget': 'toggle'
		})
	};

	const errors = new SvelteMap(
		[
			'checkbox',
			'checkboxes',
			'file',
			'multiFile',
			'number',
			'radio',
			'select',
			'multiSelect',
			'text',
			'textarea',
			'toggle'
		].map((key) => [
			key,
			[
				{
					error: null,
					instanceId: `root_${key}_error`,
					propertyTitle: 'error',
					message: `${key} error`
				}
			] satisfies ValidationError<unknown>[]
		])
	);

	const validator = new AjvValidator(addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)), uiSchema);
</script>

<Form {...rest} {...theme} {schema} {uiSchema} {validator} {translation} {errors} />
