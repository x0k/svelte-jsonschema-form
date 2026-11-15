/**
 * Svelte CSS scope hash that does not depend on the file system location.
 *
 * Svelte's default hash is derived from the absolute component filename. For
 * components from `node_modules` that path includes pnpm's virtual store
 * directory, which embeds the resolved dependency versions, so the generated
 * class names change on unrelated dependency bumps. Hashing the component
 * name and its styles keeps the output stable across installs.
 *
 * @param {{ css: string, name: string, hash: (str: string) => string }} options
 * @returns {string}
 */
export function cssHash({ css, name, hash }) {
  return `svelte-${hash(name + css)}`;
}
