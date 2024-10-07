<script lang="ts">
  import Ajv from 'ajv';
  import { Form } from '@sjsf/form';
	import { translation } from '@sjsf/form/translations/en';
	import { theme } from '@sjsf/form/themes/basic';
	import { AjvValidator } from '@sjsf/form/validators/ajv';

	const validator = new AjvValidator(new Ajv({
		allErrors: true,
		multipleOfPrecision: 8,
		strict: false,
		verbose: true,
		discriminator: true,
	}));
</script>

<Form
	{...theme}
	schema={{
		title: 'Tasks',
		type: 'array',
		items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        description: {
          type: 'string',
          title: 'Description',
        },
      }
    },
	}}
	{validator}
	{translation}
	onSubmit={console.log}
/>