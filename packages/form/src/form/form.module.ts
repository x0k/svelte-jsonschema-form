import type { Snippet } from "svelte";

import type { Config } from "./config.js";

declare module "./components.js" {
  interface FoundationalComponents {
    form: {};
  }
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
