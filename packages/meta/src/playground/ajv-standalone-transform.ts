export type RuntimeModules = Record<string, unknown>;

export function transformStandaloneCode(
  code: string,
  runtimeModules: RuntimeModules = {}
): string {
  const entries = Object.entries(runtimeModules)
    .map(([k, v]) => {
      const val = typeof v === "function" ? v.toString() : JSON.stringify(v);
      return `${JSON.stringify(k)}: ${val}`;
    })
    .join(", ");
  const shim = `const require = (name) => ({${entries}})[name];\n`;
  return shim + code;
}
