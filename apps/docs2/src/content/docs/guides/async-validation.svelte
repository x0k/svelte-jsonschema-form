<script lang="ts">
  import Ajv, { type AsyncSchema, type SchemaValidateFunction } from "ajv";
  import {
    addFormComponents,
    createAsyncFormValidator,
  } from "@sjsf/ajv8-validator";
  import { ON_INPUT, BasicForm, createForm } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

  const ajv = addFormComponents(new Ajv());
  const validate: SchemaValidateFunction = async (schema, data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (Math.random() > 0.7) {
      throw new Error("async error");
    }
    return data.length >= schema.minimum && data.length <= schema.maximum;
  };
  ajv.addKeyword({
    keyword: "asyncLength",
    async: true,
    type: "string",
    validate,
  });

  const schema: AsyncSchema = {
    $async: true,
    type: "string",
    pattern: "^\\d+$",
    asyncLength: {
      minimum: 3,
      maximum: 6,
    },
  };

  const form = createForm({
    ...defaults,
    validator: createAsyncFormValidator({ ajv }),
    schema,
    fieldsValidationMode: ON_INPUT,
    onSubmit: console.log,
  });
</script>

<p>
  The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)
</p>
<p>
  form validation: {form.submission.status}, fields validation: {form
    .fieldsValidation.status}, errors: {form.errors.size > 0}
</p>
<BasicForm {form} novalidate autocomplete="off" />
