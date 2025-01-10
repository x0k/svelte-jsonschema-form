<script lang="ts">
	import { translation } from '@sjsf/form/translations/en';
	import { validator } from 'testing/demo';

	import { theme, setThemeContext } from '$lib/theme/index';
	import { components } from '$lib/default-ui';

	import '../../app.css';

  import { FormContent, useForm2 } from './form'

	setThemeContext({ components });

	const form = useForm2({
		...theme,
		schema: {
			type: 'object',
			required: ['title'],
			properties: {
				tasks: {
					type: 'array',
					title: 'Tasks',
					items: {
						type: 'object',
						required: ['title'],
						properties: {
							title: {
								type: 'string',
								title: 'Title',
								description: 'A sample title'
							},
						}
					}
				}
			}
		},
		initialValue: {
			tasks: [
				{
					title: 'My first task',
				},
				{
					title: 'My second task',
				}
			]
		},
		translation,
		validator
	});
</script>

<FormContent bind:value={form.formValue} />
