<script lang="ts">
  import { type SchemaValue, FormContent, SubmitButton } from "@sjsf/form";
  import { components } from "@sjsf/shadcn-theme/default";
  import { setThemeContext } from "@sjsf/shadcn-theme";

  import type { themes } from "./themes";

  interface Props {
    html5Validation: boolean;
    themeName: keyof typeof themes;
    lightOrDark: "light" | "dark";
    form: HTMLFormElement | undefined;
    value: SchemaValue | undefined;
  }

  let {
    form = $bindable(),
    value = $bindable(),
    themeName,
    lightOrDark,
    html5Validation,
  }: Props = $props();

  if (themeName === "shadcn") {
    setThemeContext({ components });
  }
</script>

<form
  data-theme={themeName === "skeleton" ? "cerberus" : lightOrDark}
  class={lightOrDark}
  style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem; padding: 0.3rem;"
  bind:this={form}
  novalidate={!html5Validation || undefined}
>
  <FormContent bind:value />
  <SubmitButton />
</form>
