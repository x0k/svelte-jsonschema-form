import type { ItemTitle } from "./model.js";

declare module "../../form/index.js" {
  interface UiOptions {
    /**
     * Allow adding new items to the array schema.
     * @default true
     */
    addable?: boolean;
    /**
     * Allow reordering items in the array schema.
     * If you want an orderable array of file fields, set this to `true` explicitly.
     * @default true
     */
    orderable?: boolean;
    /**
     * Allow removing items from the array schema.
     * @default true
     */
    removable?: boolean;
    /**
     * Allow duplicating items in the array schema.
     * @default false
     */
    copyable?: boolean;
    /**
     * Overrides the logic for creating a title for array elements
     */
    itemTitle?: ItemTitle;
  }
}
