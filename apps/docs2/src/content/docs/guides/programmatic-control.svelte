<script lang="ts">
  import {
    Content,
    createForm,
    Form,
    setFormContext2,
    type Schema,
  } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    ...defaults,
    schema,
    initialValue: "initial",
    onSubmit: (v) => window.alert(v),
  });
  setFormContext2(form);

  let ref: HTMLFormElement | undefined;
</script>

<Form bind:ref>
  <Content />
</Form>
<button
  onclick={(_e) => {
    ref?.requestSubmit();
    // or
    // form.submit(new SubmitEvent("submit", { submitter: _e.currentTarget }));
    // (`target` and `currentTarget` will not be properly set)
  }}>My submit</button
>
<button
  onclick={() => {
    ref?.reset();
    // or
    // form.reset(new Event("reset"))
    // (`target` and `currentTarget` will not be properly set)
  }}
>
  My reset
</button>
