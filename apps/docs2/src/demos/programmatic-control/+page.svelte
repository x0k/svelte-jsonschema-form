<script lang="ts">
  import {
    Content,
    createForm,
    reset,
    Root,
    setFormContext,
    validate,
    type Schema,
  } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    ...defaults,
    schema,
    initialValue: "initial",
    onValid: (v) => window.alert(v),
  });
  setFormContext(form);
</script>

<form novalidate>
  <Root>
    <Content />
  </Root>
</form>
<button
  onclick={() => {
    void validate(form);
    // or
    // validate(form, { onValid }) to handle the validation result
  }}>My submit</button
>
<button
  onclick={() => {
    reset(form);
    // or
    // ref?.reset() to reset the native form element only
  }}
>
  My reset
</button>
