# Backend Engineering Guidelines

These rules apply to the NestJS backend in `apps/api`. Read them before changing
backend code, tests, or configuration. Follow the repository's [AGENTS.md](../AGENTS.md)
and the user's instructions for the current task.

## Before making changes

- Inspect the relevant implementation, package scripts, and tests. Reuse established
  patterns rather than choosing a new approach for each feature.
- Check `git status`, the unstaged diff, and the staged diff. Preserve unrelated
  changes and the user's staging choices; do not reset, stage, or commit their work
  unless asked.
- Identify the requested behavior, affected API contracts, and relevant verification
  before editing. Ask about unresolved product decisions; discover repository facts
  by inspecting the code.

## Keep the design simple

- Use standard Nest modules, controllers, and services. Group related files by
  feature when adding a feature; create folders and providers only when needed.
- Controllers handle the HTTP boundary: routing, inputs, status codes, and
  delegation. Services own business behavior and can be reused independently of
  a particular controller.
- Introduce DTOs or input types for actual boundaries. Validate external input at
  runtime; TypeScript types alone do not validate incoming data. Follow an existing
  validation approach where available and discuss a new dependency when needed.
- Extract shared code when there is a concrete shared responsibility. Prefer a
  small local helper when it makes the current code easier to understand.
- Do not introduce generic base classes, repository layers, factories, wrappers,
  empty modules, or new packages solely for possible future requirements.
- Keep refactors tied to the requested change. Record unrelated improvement ideas
  separately rather than expanding the task.

## Code conventions

- Use descriptive English names: PascalCase for classes and types, camelCase for
  functions and variables, and the existing Nest file naming pattern such as
  `shipment.controller.ts`, `shipment.service.ts`, and `shipment.module.ts`.
- Give each function a clear responsibility. Split code when doing so improves
  understanding; do not enforce arbitrary line limits or create one helper per line.
- Follow the backend's TypeScript strict configuration and existing Prettier/Oxlint
  settings. Format the files you change, not the entire repository.
- Keep `.js` extensions on local TypeScript imports, matching this package's ESM
  and `nodenext` configuration.
- Define input/output contracts clearly and reuse the same type when reading and
  writing the same data. Prefer inference for obvious local variables.
- Treat unknown external values as `unknown` and narrow them. Avoid `any`, double
  assertions, and lint/type-check suppressions; where interoperability requires an
  exception, keep it local and explain why.
- Handle asynchronous work explicitly. Do not leave rejected promises unhandled
  or hide failures behind an empty `catch`.
- Comments should explain intent or a constraint that the code cannot express.
  Remove unused code introduced or made obsolete by the current change.

## API behavior, errors, and logging

- Preserve existing routes, status codes, and response shapes unless the task
  requires a change. Use appropriate HTTP statuses and Nest exceptions for expected
  failures. Do not add a global response envelope or error framework by default.
- Keep internal exception details out of public error responses. Do not turn an
  unexpected failure into a success response or silently discard it.
- Use the existing Nest/Pino integration and follow [Logging](logging.md). Reuse
  the request context and the existing automatic HTTP log; do not add a second
  automatic log in every controller or service.
- Use `setHttpLogSummary()` only for relevant, explicitly selected input/result
  fields. Never log whole request objects, credentials, environment contents, or
  personal data indiscriminately. Redaction does not make arbitrary payloads safe.
- Add application logs when they explain a meaningful event or failure; avoid
  tracing every function call. Preserve current logging defaults.

## Integration and API testing

New automated coverage should use **integration/API tests**. Standalone unit tests
are not a requirement for new work. Preserve existing tests and update affected
expectations when an intentional behavior change requires it.

- For new or changed behavior, test the observable use case through its API where
  an endpoint exists. For behavior without an HTTP entry point, use a Nest testing
  module that exercises the relevant providers together.
- Use the installed Nest testing utilities, Vitest, and Supertest. Put new tests
  under `apps/api/test/` with the `.e2e-spec.ts` suffix so the existing
  `vitest.config.e2e.ts` discovers them. Do not add production endpoints for tests.
- Keep the application components under test connected. Replace external services
  at their boundaries when necessary for deterministic tests; avoid mocking every
  internal method and merely asserting that one mock called another.
- Cover the successful path and failures relevant to the change. For example,
  check invalid input, missing resources, or authorization failures when the
  endpoint implements those behaviors. Assert meaningful status codes, response
  fields, and side effects rather than large incidental snapshots.
- For a behavior bug, add a regression test that fails for the original bug and
  passes with the fix. Prefer extending an existing scenario when suitable.
- Keep test data isolated, avoid dependence on test order or real production
  services, and close Nest applications and other resources after tests.
- Do not require a test per function, a fixed coverage percentage, or new tests
  for documentation, formatting, and other changes with no behavioral impact.

## Verification before handoff

Run commands from the repository root. Select checks based on the change:

| Change | Required verification |
| --- | --- |
| Documentation or comments only | Check instructions, links, and commands; run `git diff --check`. |
| Backend behavior or bug fix | Relevant integration/API tests, backend lint, build, and type-check. |
| Endpoint, middleware, guard, filter, or request lifecycle | Backend checks above, including HTTP tests for affected behavior and failures. |
| Shared backend runtime, logging, configuration, or dependency changes | Full backend integration/API suite plus lint, build, and type-check; inspect affected startup/runtime behavior. |
| Types or formatting with no behavior change | Backend lint, build, and type-check; run relevant integration/API tests if runtime behavior could be affected. |

Available commands:

```sh
pnpm --filter api lint
pnpm --filter api build
pnpm --filter api exec tsc --noEmit -p tsconfig.json
pnpm --filter api test:e2e
git diff --check
```

The type-check includes test files as well as source. To run a focused HTTP suite,
use the existing Vitest configuration, for example:

```sh
pnpm --filter api exec vitest run --config ./vitest.config.e2e.ts test/logging.e2e-spec.ts
```

Inspect the final diff for unintended edits. Report what changed, which checks
actually ran, and their results. If a required check is blocked by permissions,
missing services, or tooling, report the exact gap and next step; do not claim
verification is complete. Once the relevant checks pass, repeat them only when
further changes or new evidence justify it.

## Decisions and scope

- Agents may make routine implementation decisions within the existing patterns.
  No extra approval is needed for an already authorized change or related cleanup.
- Discuss a new production dependency, architecture change, or incompatible API
  contract before implementing it unless the user has already authorized it.
- Use existing tooling. Discuss a missing test-tooling setup before introducing
  it; do not silently expand a feature into a tooling or CI project.
- Choose database, authentication, validation, and API-generation tooling when a
  task requires those decisions. Planned technologies elsewhere in the repository
  are not instructions to install them for every backend feature.
- Update relevant documentation when changing a documented command, convention,
  or behavior. These guidelines define the workflow; automated enforcement depends
  on the tooling actually configured in the repository.
