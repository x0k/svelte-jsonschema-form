<script lang="ts">
  import Ajv from 'ajv';
	import { Form } from '@sjsf/form';
	import { addFormComponents, AjvValidator, DEFAULT_AJV_CONFIG } from '@sjsf/ajv8-validator';
	import { translation } from '@sjsf/form/translations/en';
  
  import "../app.css";
	import { theme } from '../lib/index.js';
  import { schema, uiSchema, errors } from './schema'

	const validator = $derived(
		new (AjvValidator)(
			addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)),
			uiSchema
		)
	);
</script>

<Form
  {...theme}
  {schema}
  {uiSchema}
  {validator}
  {translation}
  {errors}
/>
