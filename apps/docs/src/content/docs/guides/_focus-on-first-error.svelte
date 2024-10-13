<script lang="ts">
  import { type Schema } from "@sjsf/form";
  import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

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

<CustomForm {schema} novalidate onSubmitError={focusOnFirstError} />
