<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";
  import * as createUser from "../create-user";

  const { defaults } = getDemoContext();

  const form = createForm<createUser.Model>({
    ...defaults,
    ...createUser,
    onSubmit: ({ name }) => window.alert(`Hello, ${name}`),
  });
</script>

<BasicForm {form} />

<pre>{JSON.stringify(getValueSnapshot(form), createUser.withFile, 2)}</pre>
