type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

interface RawPackage {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
}

export interface AbstractPackage {
  name: string;
  version: string;
  dev: boolean;
}

export interface PackageDependency extends AbstractPackage {
  optional: boolean;
}

export interface Package extends AbstractPackage {
  dependencies: PackageDependency[];
}

const EXTRA_PACKAGES = {
  ajvFormat: {
    name: "avj-format",
    version: "^3.0.0",
    dev: false,
  },
  jsonSchemaToTs: {
    name: "json-schema-to-ts",
    version: "^3.0.0",
    dev: true,
  },
} as const satisfies Record<string, AbstractPackage>;

export type ExtraPackage = keyof typeof EXTRA_PACKAGES;

const OPTIONAL_PKG = {
  skeletonSvelte: "@skeletonlabs/skeleton-svelte",
  internationalizedDate: "@internationalized/date",
  standardSchemaSpec: "@standard-schema/spec",
  cally: "cally",
  pikaday: "pikaday",
};

export type OptionalPackage = keyof typeof OPTIONAL_PKG;

const DEV_PACKAGES_REGISTRY = new Set([
  "@tailwindcss/forms",
  "flowbite",
  "@picocss/pico",
]);

export function fromPackageJson({
  name,
  version,
  peerDependencies = {},
  peerDependenciesMeta = {},
}: RawPackage): Package {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return {
    name,
    version: `^${version}`,
    dev: DEV_PACKAGES_REGISTRY.has(name),
    dependencies: Object.entries(peerDependencies).map(([name, version]) => ({
      name,
      version: formatPeerDependencyVersion(version),
      optional: isOptional(name),
      dev: DEV_PACKAGES_REGISTRY.has(name),
    })),
  };
}

function formatPeerDependencyVersion(version: string) {
  return version.replace("workspace:", "").split("||").at(-1)!.trim();
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

export type IncludeOptional = boolean | Iterable<string>;

export function* filterPackageDependencies(
  dependencies: Iterable<PackageDependency>,
  includeOptional: IncludeOptional,
): Iterable<PackageDependency> {
  let isIncluded: (d: PackageDependency) => boolean;
  if (typeof includeOptional === "boolean") {
    isIncluded = () => includeOptional;
  } else {
    const toInclude = new Set(includeOptional);
    isIncluded = (d) => toInclude.has(d.name);
  }
  for (const d of dependencies) {
    if (!d.optional || isIncluded(d)) {
      yield d;
    }
  }
}

export function extraPackage(extraPkg: ExtraPackage): AbstractPackage {
  return EXTRA_PACKAGES[extraPkg];
}

export function optionalPackageName(optionalPkg: OptionalPackage): string {
  return OPTIONAL_PKG[optionalPkg];
}
