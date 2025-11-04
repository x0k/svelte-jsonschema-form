<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from '@sjsf/valibot-validator';
  import * as v from "valibot";

  import * as defaults from "$lib/form-defaults";

  const schema = v.pipe(
    v.object({
      hello: v.string(),
    }),
    v.metadata({
      title: 'Basic form'
    })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
