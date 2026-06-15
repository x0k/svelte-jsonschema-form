import type { Popover } from "bits-ui";
import type { Component } from "svelte";

declare module "../context.js" {
  interface ThemeComponents {
    Popover: Component<Popover.RootProps, {}, "open">;
    PopoverTrigger: Component<Popover.TriggerProps>;
    PopoverContent: Component<Popover.ContentProps>;
  }
}
