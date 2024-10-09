<script lang="ts">
  import Ajv from 'ajv';
  import { Form } from '@sjsf/form';
  import { translation } from '@sjsf/form/translations/en';
  import { theme } from '@sjsf/form/basic-theme';
  import { AjvValidator } from '@sjsf/ajv8-validator';

  const validator = new AjvValidator(new Ajv({
    allErrors: true,
    multipleOfPrecision: 8,
    strict: false,
    verbose: true,
    discriminator: true,
  }));

  let value = $state()
</script>

<Form
  bind:value
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
      },
      required: ["name"]
    },
  }}
  {validator}
  {translation}
>
  <pre><code>{JSON.stringify(value, null, 2)}</code></pre>
</Form>
