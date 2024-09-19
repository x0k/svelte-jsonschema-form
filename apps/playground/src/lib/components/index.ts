import type { Component, Components, ComponentType } from '@/components/form';

import Form from "./form.svelte";
import Button from "./button.svelte";
import Layout from "./layout.svelte";

export const registry: { [T in ComponentType]: Component<T> } = {
  form: Form,
  button: Button,
  layout: Layout,
};

export const components: Components = (type) => registry[type];
