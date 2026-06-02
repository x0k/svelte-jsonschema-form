import { SandboxPlatform, type SandboxOptions } from "./model.js";

const PLATFORM_FACTORIES: Record<
  SandboxPlatform,
  () => Promise<{ default: (opts: SandboxOptions) => void }>
> = {
  [SandboxPlatform.StackBlitz]: () => import("./platforms/stackblitz.ts"),
  [SandboxPlatform.SvelteLab]: () => import("./platforms/svelte-lab.ts"),
};

export async function sandboxOpen(options: SandboxOptions) {
  const factory = await PLATFORM_FACTORIES[options.platform]();
  factory.default(options);
}
