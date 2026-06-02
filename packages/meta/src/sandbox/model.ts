export enum SandboxPlatform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
}

export const SANDBOX_PLATFORMS = Object.values(SandboxPlatform);

export interface SandboxOptions {
  name: string;
  platform: SandboxPlatform;
  files: Record<string, string>;
}

export const INITIAL_FILE = "src/routes/+page.svelte";
