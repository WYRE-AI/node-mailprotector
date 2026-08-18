# Contributing to node-mailprotector

Thanks for helping improve the Mailprotector client library.

## Development setup

```bash
export NODE_AUTH_TOKEN=$(gh auth token)   # GitHub Packages registry auth
npm install
```

## Workflow

- `npm run build` — tsup dual ESM + CJS build with declarations.
- `npm test` — vitest + MSW test suite (no network access; MSW errors on any unhandled request).
- `npm run lint` — TypeScript type check (`tsc --noEmit`).

All three must pass before a PR is merged.

## Commit messages

This repo releases via [semantic-release](https://semantic-release.gitbook.io/); commit
messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

- `fix:` — patch release
- `feat:` — minor release
- `feat!:` / `BREAKING CHANGE:` — major release
- `docs:`, `test:`, `chore:`, `refactor:` — no release

## Guidelines

- **Zero runtime dependencies.** The SDK uses native `fetch` only; do not add runtime deps.
- Every new resource or behavior needs MSW-backed tests, including error paths
  (401/404/429).
- Response types keep non-`id` fields optional — Mailprotector's examples are the only
  documentation of the shapes, and fields drift between scopes.
- Multi-scope operations (messages, allow/block rules, logs, configuration, …) go through
  the `scopePath()` helper — never hand-build `/{scopes}/{id}/...` paths in resources.
- Update `CHANGELOG.md` under `[Unreleased]` following
  [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Never commit credentials or fixtures containing real tenant data.
