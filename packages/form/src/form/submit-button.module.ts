import type { Snippet } from "svelte";

import type { Config } from "./config.js";

declare module "./theme.js" {
  interface ComponentProps {
    submitButton: {
      config: Config;
      children: Snippet;
    };
  }
  interface ComponentBindings {
    submitButton: "";
  }
}
