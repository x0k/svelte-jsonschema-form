type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

interface RawPackage {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
  repository?: {
    directory?: string;
  };
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
  directory: string;
  dependencies: PackageDependency[];
}

const EXTRA_PACKAGES = {
  ajvFormat: {
    name: "ajv-formats",
    version: "3.0.0",
    dev: false,
  },
  jsonSchemaToTs: {
    name: "json-schema-to-ts",
    version: "3.0.0",
    dev: true,
  },
  esbuild: {
    name: "esbuild",
    version: "0.28.0",
    dev: true,
  },
  devalue: {
    name: "devalue",
    version: "5.7.0",
    dev: true,
  },
  pico: {
    name: "@picocss/pico",
    version: "2.1.0",
    dev: true,
  },
  vite: {
    name: "vite",
    version: "8.0.10",
    dev: true,
  },
  typescript: {
    name: "typescript",
    version: "6.0.0",
    dev: true,
  },
  svelteVitePlugin: {
    name: "@sveltejs/vite-plugin-svelte",
    version: "7.1.2",
    dev: true,
  },
  svelteAdapterAuto: {
    name: "@sveltejs/adapter-auto",
    version: "7.0.1",
    dev: true,
  },
  tailwindcss3: {
    name: "tailwindcss",
    version: "3.4.17",
    dev: true,
  },
  postcss: {
    name: "postcss",
    version: "8.5.6",
    dev: true,
  },
  tailwindcss4: {
    name: "tailwindcss",
    version: "4.3.0",
    dev: true,
  },
  tailwindcss4Vite: {
    name: "@tailwindcss/vite",
    version: "4.3.0",
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
  repository: { directory = "" } = {},
}: RawPackage): Package {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return {
    name,
    version,
    dev: DEV_PACKAGES_REGISTRY.has(name),
    directory,
    dependencies: Object.entries(peerDependencies).map(([name, version]) => ({
      name,
      version: formatPeerDependencyVersion(version),
      optional: isOptional(name),
      dev: DEV_PACKAGES_REGISTRY.has(name),
    })),
  };
}

const VERSION_MODIFIERS = ["^", "~"];
function formatPeerDependencyVersion(version: string) {
  let v = version.replace("workspace:", "").split("||").at(-1)!.trim();
  const m = VERSION_MODIFIERS.find((m) => v.startsWith(m));
  if (m) {
    v = v.slice(m.length);
  }
  return v;
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
