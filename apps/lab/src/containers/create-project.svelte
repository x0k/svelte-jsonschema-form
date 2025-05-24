<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";

  import { PROJECT_SETTINGS, type ProjectSettings } from "@/domain/index.js";
  import * as defaults from "@/components/form-defaults.js";

  interface Props {
    createProject: (settings: ProjectSettings) => void;
  }

  const { createProject }: Props = $props();

  const form = createForm({
    ...defaults,
    onSubmit: createProject,
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

<BasicForm {form} />
