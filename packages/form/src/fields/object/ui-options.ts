import type { AdditionalPropertyKey } from "./model.js";

declare module "../../form/index.js" {
  interface UiOptions {
    /**
     * Order of properties in the object schema.
     * You must specify all properties or use the wildcard `*`.
     */
    order?: string[];
    /**
     * Allow adding new properties to the object schema with `additionalProperties`.
     * @default true
     */
    expandable?: boolean;
    /**
     * Prefix of the new additional property key
     */
    additionalPropertyKeyPrefix?: string;
    /**
     * Overrides the logic for creating a new key for an additional property
     */
    additionalPropertyKey?: AdditionalPropertyKey;
  }
}
