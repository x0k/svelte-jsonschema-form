import type { Component } from "svelte";

export interface DemoData {
  files: Record<string, string>;
  Component: Component;
}

export type DemoName =
  | "simple-setup";

export const DEMOS: Record<DemoName, () => Promise<{ default: DemoData }>> = {
  "simple-setup": () => import("./demos/simple-setup.ts"),
};
