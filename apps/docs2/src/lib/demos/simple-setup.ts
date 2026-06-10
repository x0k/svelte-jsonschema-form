import type { Component } from "svelte";
import PageComponent from "../../demos/simple-setup/+page.svelte";
import pageSvelte from "../../demos/simple-setup/+page.svelte?raw";

const files: Record<string, string> = {
  "+page.svelte": pageSvelte,
};

export default { files, Component: PageComponent } satisfies {
  files: Record<string, string>;
  Component: Component;
};
