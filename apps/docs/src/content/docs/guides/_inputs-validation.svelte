<script lang="ts">
  import {
    type Schema,
    ON_CHANGE,
    ON_INPUT,
    AFTER_SUBMITTED,
  } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  const schema: Schema = {
    type: "object",
    properties: {
      number: {
        type: "number",
        minimum: 5,
      },
      select: {
        type: "string",
        enum: ["one", "two", "three"],
      },
      text: {
        type: "string",
        minLength: 5,
      },
    },
    required: ["number", "text", "select"],
  };
</script>

<CustomForm
  {schema}
  inputsValidationMode={ON_INPUT | ON_CHANGE | AFTER_SUBMITTED}
  novalidate
  onSubmit={console.log}
/>
