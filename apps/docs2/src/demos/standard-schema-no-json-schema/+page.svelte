<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/form/validators/standard-schema";
  import { JSONSchema, Schema } from "effect";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const Person = Schema.Struct({
    name: Schema.propertySignature(Schema.String).annotations({
      title: "Name",
    }),
    email: Schema.propertySignature(
      Schema.String.pipe(Schema.pattern(/^[\w.-]+@[\w.-]+\.\w+$/))
    ).annotations({ title: "Email" }),
    age: Schema.propertySignature(
      Schema.Number.pipe(Schema.greaterThan(18))
    ).annotations({ title: "Age" }),
  }).annotations({ title: "Person" });

  const form = createForm({
    ...defaults,
    schema: JSONSchema.make(Person),
    validator: createFormValidator(Schema.standardSchemaV1(Person)),
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
