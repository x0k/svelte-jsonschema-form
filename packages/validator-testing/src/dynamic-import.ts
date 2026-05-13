export function encodeModule(code: string) {
  return `data:text/javascript,${encodeURIComponent(code)}`;
}

export async function importModule<M>(code: string): Promise<M> {
  return import(
    /* @vite-ignore */
    encodeModule(code)
  ) as Promise<M>;
}
