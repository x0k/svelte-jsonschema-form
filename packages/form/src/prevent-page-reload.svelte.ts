import { on } from "svelte/events";

export function preventPageReload(isChanged: () => boolean) {
  $effect(() =>
    on(window, "beforeunload", (e) => {
      if (isChanged()) {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        e.returnValue = "";
      }
    })
  );
}
