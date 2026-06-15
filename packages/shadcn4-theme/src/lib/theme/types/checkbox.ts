import type { CheckboxRootProps, WithoutChildrenOrChild } from "bits-ui";
import type { Component } from "svelte";

export type CheckboxProps = WithoutChildrenOrChild<CheckboxRootProps>;

declare module "../context.js" {
  interface ThemeComponents {
    Checkbox: Component<CheckboxProps, {}, "checked" | "indeterminate" | "ref">;
  }
}
