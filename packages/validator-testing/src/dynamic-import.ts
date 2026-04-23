export async function importModule<M>(code: string): Promise<M> {
  return import(/* @vite-ignore */ `data:text/javascript;base64,${btoa(code)}`);
}
