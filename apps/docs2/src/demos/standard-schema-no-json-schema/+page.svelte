<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/form/validators/standard-schema";
  import { Schema } from "effect";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const Person = Schema.Struct({
    name: Schema.String.annotate({ title: "Name" }),
    email: Schema.String.check(
      Schema.isPattern(/^[\w.-]+@[\w.-]+\.\w+$/u)
    ).annotate({ title: "Email" }),
    age: Schema.Finite.check(Schema.isGreaterThan(18)).annotate({
      title: "Age",
    }),
  }).annotate({ title: "Person" });

  const form = createForm({
    ...defaults,
    schema: Schema.toJsonSchemaDocument(Person).schema,
    validator: createFormValidator(Schema.toStandardSchemaV1(Person)),
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
