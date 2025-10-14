import type { Snippet } from "svelte";

import type { Config, FieldErrors } from "@/form/index.js";

export interface ComponentCommonProps {
  config: Config;
  errors: FieldErrors;
}

export interface ButtonTypes {}

export type ButtonType = keyof ButtonTypes;

export interface LayoutTypes {}

export type LayoutType = keyof LayoutTypes;

declare module "../form/index.js" {
  interface FoundationalComponents {
    button: {};
    layout: {};
  }
  interface ComponentProps {
    button: ComponentCommonProps & {
      type: ButtonType;
      disabled: boolean;
      children: Snippet;
      onclick: () => void;
    };
    layout: ComponentCommonProps & {
      type: LayoutType;
      children: Snippet;
    };
  }
  interface ComponentBindings {
    button: "";
    layout: "";
  }
}
