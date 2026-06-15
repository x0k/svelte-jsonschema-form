export enum SandboxPlatform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
  Local = "Local",
}

export const SANDBOX_PLATFORMS = Object.values(SandboxPlatform);

export interface SandboxOptions {
  name: string;
  platform: SandboxPlatform;
  files: Record<string, string>;
}

export const INITIAL_FILE = "src/routes/+page.svelte";

export function sandboxPlatformLabel(platform: SandboxPlatform): string {
  switch (platform) {
    case SandboxPlatform.Local:
      return "Download project";
    default:
      return `Open in ${platform}`;
  }
}

export function sandboxPlatformIcon(
  platform: SandboxPlatform
): "external-link" | "download" {
  switch (platform) {
    case SandboxPlatform.Local:
      return "download";
    default:
      return "external-link";
  }
}
