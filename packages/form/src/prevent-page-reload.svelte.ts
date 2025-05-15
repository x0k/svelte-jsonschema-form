import { on } from "svelte/events";

export function preventPageReload(data: { isChanged: boolean }) {
  $effect(() =>
    on(window, "beforeunload", (e) => {
      if (data.isChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    })
  );
}
