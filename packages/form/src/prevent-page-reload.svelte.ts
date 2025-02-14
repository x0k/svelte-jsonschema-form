export function preventPageReload(data: { isChanged: boolean }) {
  function handleBeforeUnload(e: BeforeUnloadEvent) {
    if (data.isChanged) {
      e.preventDefault();
      e.returnValue = "";
    }
  }
  $effect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
}
