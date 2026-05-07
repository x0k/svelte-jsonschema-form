// export async function importModule<M>(code: string): Promise<M> {
//   return import(/* @vite-ignore */ `data:text/javascript;base64,${btoa(code)}`);
// }
export async function importModule<M>(code: string): Promise<M> {
  const bytes = new TextEncoder().encode(code);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    "",
  );
  const base64 = btoa(binString);
  return import(/* @vite-ignore */ `data:text/javascript;base64,${base64}`);
}
