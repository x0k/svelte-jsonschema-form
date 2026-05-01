import type { Context } from "./model.js";
import { addToDemoPage, transforms } from "./sv-utils.js";

export function pageSvelte({
  sv,
  directory,
  options,
  language,
  ts,
  isKit,
}: Context) {
  if (isKit) {
    sv.file(
      `${directory.kitRoutes}/demo/+page.svelte`,
      addToDemoPage("sjsf", language),
    );
  }

  sv.file(
    `${directory.kitRoutes}${isKit ? "/demo/sjsf/+page.svelte" : "sjsf.svelte"}`,
    transforms.script(() => {}),
  );
}
