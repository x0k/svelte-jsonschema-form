<script lang="ts">
  import Ajv from "ajv";

  import { components } from "@/lib/components";
  import { widgets } from "@/lib/widgets";
  import { AjvValidator } from "@/lib/validator";
  import { enTranslator } from "@/lib/translator";
  import { Form } from "@/components/form";

  const validator = new AjvValidator(
    new Ajv({
      allErrors: true,
      multipleOfPrecision: 8,
      strict: false,
      verbose: true,
      discriminator: true,
    })
  );
</script>

<p>
  App
  <Form
    {components}
    {widgets}
    schema={{
      type: "string",
      title: "Text",
    }}
    {validator}
    translator={enTranslator}
  />
</p>
