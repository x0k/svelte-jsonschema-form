<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import type { Resource } from "@/lib/resource.js";
  import { PROJECT_SETTINGS } from "@/domain/index.js";
  import * as defaults from "@/components/form-defaults.js";

  interface Props {
    // projectsService: ProjectsService;
  }

  const {}: Props = $props();

  const form = createForm({
    ...defaults,
    schema: PROJECT_SETTINGS,
    uiSchema: {
      "ui:options": {
        translations: {
          submit: "Create",
        },
      },
      preset: {
        "ui:components": {
          stringField: "enumField",
          selectWidget: "radioButtonsWidget",
        },
        "ui:options": {
          daisyui5RadioButtons: {
            style: "flex-grow: 1;",
          },
        },
      },
    },
  });
</script>

<div>
  <BasicForm {form} />
</div>
