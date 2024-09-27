import type { Component, Components, ComponentType } from "@/components/form";

import Form from "./form.svelte";
import Button from "./button.svelte";
import Layout from "./layout.svelte";
import Alert from "./alert.svelte";
import Title from "./title.svelte";
import Description from "./description.svelte";
import HelpComponent from "./help-component.svelte";

export const registry: { [T in ComponentType]: Component<T> } = {
  form: Form,
  button: Button,
  layout: Layout,
  alert: Alert,
  title: Title,
  description: Description,
  help: HelpComponent,
};

export const components: Components = (type) => registry[type];
