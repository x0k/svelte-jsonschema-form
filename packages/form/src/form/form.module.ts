import type { Snippet } from "svelte";
import type { HTMLFormAttributes } from "svelte/elements";

import type { Config } from "./config.js";

declare module "./components.js" {
  interface FoundationalComponents {
    form: {};
  }
  interface ComponentProps {
    form: {
      config: Config;
      ref?: HTMLFormElement | undefined;
      children: Snippet;
      attributes?: HTMLFormAttributes | undefined;
    };
  }

  interface ComponentBindings {
    form: "ref";
  }
}
