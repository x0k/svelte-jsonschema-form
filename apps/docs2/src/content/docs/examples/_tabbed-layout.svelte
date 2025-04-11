<script lang="ts">
  import type { Schema } from "@sjsf/form";
  import { makeTabbedFocusOnFirstError, setTabsContext, type TabsContext } from "./tabs";
  import MyForm from "@/components/my-form.svelte";

  const schema = {
    title: "Multi page form",
    type: "array",
    items: [
      {
        title: "Sub page 1",
        type: "array",
        items: [
          {
            title: "First",
            type: "object",
            properties: {
              label: {
                type: "string",
                title: "Label",
              },
            },
            required: ["label"],
          },
          {
            title: "Second",
            type: "object",
            properties: {
              otherField: {
                type: "string",
                title: "Other Label",
                minLength: 3,
              },
            },
            required: ["otherField"],
          },
        ],
      },
      {
        title: "Sub page 2",
        type: "array",
        items: [
          {
            title: "Third",
            type: "object",
            properties: {
              label: {
                type: "string",
                title: "Label",
              },
            },
            required: ["label"],
          },
          {
            title: "Fourth",
            type: "object",
            properties: {
              otherField: {
                type: "string",
                title: "Other Label",
                minLength: 3,
              },
            },
            required: ["otherField"],
          },
        ],
      },
    ],
  } as const satisfies Schema;

  const tabsCtx: TabsContext = new Map();
  setTabsContext(tabsCtx);
</script>

<MyForm {schema} onSubmitError={makeTabbedFocusOnFirstError(tabsCtx)} />
