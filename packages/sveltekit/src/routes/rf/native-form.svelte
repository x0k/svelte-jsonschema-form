<script lang="ts">
  import { Content, createForm, setFormContext, SubmitButton } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/index.js';

  import * as defaults from '../form-defaults.js';
  import { schema, uiSchema } from '../model.js';

  import { createPost } from './data.remote.js';

  const native = createPost.for('native')

  const initialValue = $derived(await native.fields.value())

  const form = createForm({
    ...defaults,
    idPrefix: 'native',
    get initialValue() {
      return initialValue;
    },
    get initialErrors() {
      // @ts-expect-error
      return native.fields.allIssues()?.map((i) => ({
        path: [],
        message: i.message
      }));
    },
    resolver,
    idBuilder: createFormIdBuilder,
    schema,
    uiSchema
  });
  setFormContext(form);
</script>

<form novalidate enctype="multipart/form-data" {...native}>
  <Content />
  <br />
  <SubmitButton />
</form>
