import type { Snippet } from "svelte";

import type { Config } from "./config.js";

declare module "./theme.js" {
  interface ComponentProps {
    form: {
      config: Config;
      ref?: FormElement | undefined;
      children: Snippet;
      attributes?: FormAttributes | undefined;
    };
  }

  interface ComponentBindings {
    form: "ref";
  }
}
