import type { SchemaValue } from "@/core/index.js";

import type { Config } from "./config.js";

declare module "./components.js" {
  interface FoundationalComponents {
    rootField: {};
  }
  interface ComponentProps {
    rootField: {
      value: SchemaValue | undefined;
      config: Config;
    };
  }

  interface ComponentBindings {
    rootField: "value";
  }
}

declare module "./ui-schema.js" {
  interface UiOptions {
    /**
     * Overrides the title of the field.
     */
    title?: string;
  }
}
