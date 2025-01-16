<script lang="ts">
  import { Content } from "@sjsf/form";
  import { createValidator2 } from "@sjsf/ajv8-validator";
  import { theme } from "@sjsf/form/basic-theme";
  import { translation } from "@sjsf/form/translations/en";
  import { useSvelteKitForm, meta } from "@sjsf/sveltekit/client";

  import type { PageData, ActionData } from "./$types";

  const { form, enhance } = useSvelteKitForm(
    meta<ActionData, PageData>(),
    "form",
    {
      ...theme,
      validator: createValidator2(),
      translation,
    }
  );
</script>

<form
  use:enhance
  method="POST"
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
>
  <Content {form} />
  <button type="submit" style="padding: 0.5rem;">Submit</button>
</form>
