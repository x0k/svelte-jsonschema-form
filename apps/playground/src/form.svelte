<script lang="ts" generics="T, E">
  import { SvelteMap } from "svelte/reactivity";
  import { Form, type FormProps } from "@sjsf/form";
  import { components } from "@sjsf/shadcn-theme/default";
  import { setThemeContext } from "@sjsf/shadcn-theme";

  import type { themes } from "./themes";

  interface Props<T> extends FormProps<T, E> {
    themeName: keyof typeof themes;
    lightOrDark: "light" | "dark";
  }

  let {
    themeName,
    lightOrDark,
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    ...rest
  }: Props<T> = $props();

  let self: Form<T, E>;

  export function validate() {
    return self.validate();
  }

  if (themeName === "shadcn") {
    setThemeContext({ components });
  }
</script>

<Form
  data-theme={themeName === "skeleton" ? "cerberus" : lightOrDark}
  class={lightOrDark}
  style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem; padding: 0.3rem;"
  bind:this={self}
  {...rest}
  bind:value
  bind:form
  bind:isSubmitted
  bind:errors
/>
