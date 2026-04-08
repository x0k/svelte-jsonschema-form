export interface Package {
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
}

export interface PeerDependency {
  name: string;
  version: string;
  optional: boolean;
}

export function collectPeerDependencies({
  peerDependencies = {},
  peerDependenciesMeta = {},
}: Package): PeerDependency[] {
  return Object.entries(peerDependencies).map(([name, version]) => ({
    name,
    version: version.replace("workspace:", "").split("||").at(-1)!.trim(),
    optional: Boolean(peerDependenciesMeta[name]?.optional),
  }));
}
