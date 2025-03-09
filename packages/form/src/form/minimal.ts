import type { Validator } from "@/core/validator.js";

import type { Theme } from "./components.js";
import type { FormInternalContext } from "./context/context.js";

export function minimal<R extends Theme>(theme: R) {
  return <V extends Validator>(ctx: FormInternalContext<V>): R =>
    ((type, config) => {
      if (!config) return
      const { schema } = config
      if (type === "rootField") {
        
      }
      return theme(type, config);
    }) as R;
}
