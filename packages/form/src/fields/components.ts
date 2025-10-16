import type { Snippet } from "svelte";

import type { Config, FieldErrors } from "@/form/index.js";

export interface ComponentCommonProps {
  config: Config;
  errors: FieldErrors;
}

export interface ButtonTypes {}

export type ButtonType = keyof ButtonTypes;

export interface AbstractButton<T extends ButtonType>
  extends ComponentCommonProps {
  type: T;
  disabled: boolean;
  children: Snippet;
  onclick: () => void;
}

export interface LayoutTypes {}

export type LayoutType = keyof LayoutTypes;

export interface AbstractLayout<T extends LayoutType>
  extends ComponentCommonProps {
  type: T;
  children: Snippet;
}

declare module "../form/index.js" {
  interface FoundationalComponents {
    button: {};
    layout: {};
  }
  interface ComponentProps {
    button: {
      [T in ButtonType]: AbstractButton<T> & ButtonTypes[T];
    }[ButtonType];
    layout: {
      [T in LayoutType]: AbstractLayout<T> & LayoutTypes[T];
    }[LayoutType];
  }
  interface ComponentBindings {
    button: "";
    layout: "";
  }
}
