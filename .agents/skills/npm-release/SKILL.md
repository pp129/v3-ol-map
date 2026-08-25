---
name: npm-release
description: Use when explicitly asked to release this repository's accumulated functional, architectural, bug-fix, or compatibility changes to npm.
---

# NPM Release

Release `v3-ol-map` only after the source commit is safely pushed. Explicit `$npm-release` invocation authorizes the version edit, Git commit/push, and `npm publish`.

## Preconditions

1. Read `AGENTS.md`, `package.json`, Git status/diffs, branch, upstream, and remote. Stop for conflicts, detached HEAD, missing upstream, unrelated or ambiguous changes, suspected secrets, or credential fields in a tracked/staged `.npmrc`.
2. Read package name/version without printing npm configuration. Run `npm whoami >/dev/null 2>&1`; if it fails, stop before edits and ask the user to run `npm login` once locally. Never print, create, or commit an auth token or npm credential.
3. Get the published version with `npm view <name> version`. Stop if the local version is lower. If local is higher, allow only a clean-worktree retry whose HEAD is already pushed and whose exact version is not published.
4. For a normal release, require package-affecting changes. Documentation-only or generated-output-only changes do not justify a release.

## Choose the Version

Inspect all tracked and untracked changes and choose the highest applicable SemVer level:

| Level | Use when |
| --- | --- |
| `major` | A public export, component, prop, event, method, parameter, return value, or default behavior becomes incompatible. |
| `minor` | A backward-compatible public capability is added. |
| `patch` | A bug, compatibility issue, typing, dependency, performance, or internal architecture is improved without breaking public behavior. |

State the chosen level and concrete reason. When local equals the registry version, run `npm version <level> --no-git-tag-version`. For a verified retry, keep the existing local version.

## Verify, Commit, Publish

Run in order and stop on the first failure:

1. `nvm use`
2. `pnpm test`
3. `pnpm exec eslint "src/**/*.{ts,vue}"`
4. `pnpm build:lib`
5. `npm pack --dry-run`
6. **REQUIRED SUB-SKILL:** Read and follow the installed `commit` skill to commit all intended changes and push the current branch.
7. Confirm the worktree is clean and HEAD is present on its upstream.
8. Run `npm publish` exactly once.
9. Verify with `npm view <name>@<version> version`.

Do not tag, amend, force-push, unpublish, automatically retry publication, or roll back user changes. If commit/push succeeds but publication fails, report the pushed commit and preserve its version for a later verified retry.

## Report

Return the version decision, validation results, commit hash/branch, published package/version, and any remaining manual action. Never include npm identity, token, or `.npmrc` contents.
