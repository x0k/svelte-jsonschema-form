import type { Slider, WithoutChildrenOrChild } from "bits-ui";
import type { Component } from "svelte";

declare module "../context.js" {
  interface ThemeComponents {
    Slider: Component<
      WithoutChildrenOrChild<Slider.RootProps>,
      {},
      "value" | "ref"
    >;
  }
}
