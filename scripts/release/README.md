# Release scripts

Helpers for publishing packages with npm trusted publishing (OIDC).

npm only allows a trusted publisher to be configured for a package that
already exists. A package added to this workspace cannot be published by the
release workflow until it has been bootstrapped once.

## Requirements

- Node 22.18 or newer (the scripts are TypeScript files run directly by Node).
- npm 11.15 or newer (`npm stage` and `npm trust`). The release workflow uses
  Node 26.

## Check registry prerequisites

```sh
pnpm release:check
pnpm release:check @sjsf/new-validator
pnpm release:check --json
```

Checks every publishable workspace package (or only the named packages) against
npm. Missing packages are reported with the bootstrap command to run.

The Version and Publish workflow runs the check before the changesets action,
so a missing package blocks the release PR and the publish run. The script is
dependency-free and can run before `pnpm install`.

## Bootstrap a new package

```sh
pnpm release:bootstrap @sjsf/new-validator
```

The script:

1. Verifies the package is a publishable workspace package.
2. Stages a throwaway `0.0.0-bootstrap` version under the `bootstrap` tag. This
   creates the package name (and a public `0.0.0-stage` placeholder) without
   publishing a real version.
3. Configures the GitHub Actions trusted publisher for
   `version-and-publish.yaml`.
4. Prints the remaining release and cleanup steps.

Use `--dry-run` to print the commands without running them (no files are
created or removed), or `--no-trust` to only stage the package. `--trust` also
configures trusted publishing for packages that already exist; by default those
are only reported.

The first real release can then be published by the normal **Version and
Publish** workflow.

> **A trusted publisher expires two days after it is created unless it
> completes its first successful publish.** Bootstrap shortly before the first
> release (just before merging the release PR), not days in advance. If the
> window is missed, the configuration can no longer be used or edited: delete it
> and run `pnpm release:bootstrap …` (or `npm trust github …`) again.

### Authentication

`npm stage publish` needs an authenticated npm session but does not require
2FA. `npm trust github` prompts for 2FA and cannot be automated in CI. Run the
bootstrap command from a terminal where you are logged in as a package owner.

The script defaults to the repository and workflow file in
`.changeset/config.json` and `.github/workflows/version-and-publish.yaml`.

## Clean up after the first release

```sh
pnpm release:cleanup @sjsf/new-validator
```

After a real version is published, this rejects the staged
`0.0.0-bootstrap` entry. If the registry keeps the `0.0.0-stage` placeholder,
the script also removes that exact version, and it removes a
`0.0.0-bootstrap` version if one was approved by mistake. It refuses to clean up
when no real version exists, because unpublishing the only published version
would delete the package and its trusted publisher configuration.

Cleanup is destructive and asks for confirmation. Use `--yes` in a
non-interactive shell, or `--dry-run` to print the commands.

## Limitations

- The preflight only checks package existence. npm does not expose trusted
  publisher configuration without an authenticated 2FA request, so the preflight
  cannot verify that every package has a trusted publisher.
- The scripts resolve the registry like npm does (`.npmrc`, then
  `npm_config_registry`, then `https://registry.npmjs.org/`) and pass it to
  every npm command. Registry reads use `fetch`, which does not honour
  `HTTPS_PROXY`; if you use a proxy, run `pnpm release:check` with a registry
  that is directly reachable or check with `npm view` instead.
