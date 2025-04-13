<script lang="ts">
  import MyForm from "@/components/my-form.svelte";
  import type { Schema, UiSchemaRoot } from "@sjsf/form";

  // Based on https://habr.com/ru/articles/884862/ (RU)
  const schema = {
    title: "Fill in user information",
    type: "object",
    required: ["name", "username"],
    properties: {
      name: { type: "string", title: "Full Name" },
      username: { type: "string", title: "Username" },
      email: { type: "string", title: "E-mail" },
      telephone: { type: "string", title: "Phone" },
      telegram: { type: "string", title: "Telegram" },
      date: { type: "string", format: "date", title: "Date of Birth" },
      bio: { type: "string", title: "About Me" },
      city: { type: "string", title: "City" },
    },
  } satisfies Schema;

  const uiSchema = {
    "ui:options": {
      layouts: {
        "object-properties": {
          style:
            "display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem",
        },
      },
    },
    name: {
      "ui:options": {
        layouts: {
          "object-property": {
            style: "grid-column: 1/3;",
          },
        },
      },
    },
    bio: {
      "ui:components": {
        textWidget: "textareaWidget",
      },
      "ui:options": {
        textarea: {
          style: "flex-grow: 1",
          rows: 5
        },
        layouts: {
          "object-property": {
            style: "grid-column: 2/4; grid-row: 3/5",
          },
        },
      },
    },
  } satisfies UiSchemaRoot;
</script>

<MyForm {schema} {uiSchema} />
