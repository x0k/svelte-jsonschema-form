<script lang="ts">
  import Ajv from "ajv";

  import { componentsResolver } from "@/lib/basic";
  import { AjvValidator } from "@/lib/validator";
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
  <Form {componentsResolver} schema={{}} {validator} value />
</p>
