<script lang="ts">
  import { BasicForm, createForm, setFormContext, validate } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: objectSchema,
  });
  setFormContext(form);
  const focusOnFirstError = createFocusOnFirstError({ form });
</script>

<BasicForm
  {form}
  novalidate
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form, {
      onInvalid: focusOnFirstError(e),
    });
  }}
/>
