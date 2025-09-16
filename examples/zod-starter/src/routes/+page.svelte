<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/form-defaults";

  const schema = z
    .object({
      hello: z.string().meta({ title: "Hello" }),
    })
    .meta({ title: "Basic form" });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
