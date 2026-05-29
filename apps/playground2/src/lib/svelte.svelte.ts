export function debouncedEffect(
  actionFactory: () => () => void,
  ms: number = 300,
) {
  let callbackId: NodeJS.Timeout | undefined;
  $effect(() => {
    clearTimeout(callbackId);
    const action = actionFactory();
    callbackId = setTimeout(action, ms);
    return () => {
      clearTimeout(callbackId);
    };
  });
}
