<script lang="ts">
  import Ajv from "ajv";

  import { components } from "@/lib/basic";
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
  <Form {components} schema={{}} {validator} translator={enTranslator} />
</p>
