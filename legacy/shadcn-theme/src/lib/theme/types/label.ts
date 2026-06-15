import type { LabelRootProps } from "bits-ui";
import type { Component } from "svelte";

export type LabelProps = LabelRootProps;

declare module "../context.js" {
  interface ThemeComponents {
    Label: Component<LabelRootProps>;
  }
}
