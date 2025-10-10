<script lang="ts">
  import { BasicForm, createForm } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/compat';

  import { createFormIdBuilder } from '$lib/rf/index.js';
  import { enhance } from '$lib/rf/client/index.js';

  import * as defaults from '../form-defaults.js';
  import { schema, uiSchema } from '../model.js';

  import { createPost } from './data.remote.js';

  const form = createForm({
    ...defaults,
    get initialErrors() {
      // @ts-expect-error
      return createPost.fields.allIssues()?.map((i) => ({
        path: [],
        message: i.message
      }));
    },
    resolver,
    idBuilder: createFormIdBuilder,
    schema,
    uiSchema
  });
</script>

<BasicForm novalidate enctype="multipart/form-data" {form} {...enhance(createPost)} />
