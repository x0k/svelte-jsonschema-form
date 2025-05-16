import type { TranslatorDefinitions } from "./translation.js";

declare module "./ui-schema.js" {
  interface UiOptions {
    translations?: Partial<TranslatorDefinitions>;
  }
}
