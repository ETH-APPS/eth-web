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
- Keep routes for the same feature in one controller by default. Public and CMS
  prefixes alone do not require separate controllers. In a controller with mixed
  access, apply guards and role/permission metadata to protected methods; use
  controller-level guards only when every method has the same access policy.
  Compose repeated access metadata and Swagger security with `applyDecorators()`
  when it removes real duplication, as in Article's `@CmsAccess()` decorator.
- Controllers handle the HTTP boundary: routing, inputs, status codes, and
  delegation. Services own business behavior and can be reused independently of
  a particular controller.
- Introduce DTOs or input types for actual boundaries. Validate external input at
  runtime; TypeScript types alone do not validate incoming data. Follow an existing
  validation approach where available and discuss a new dependency when needed.
- Extract shared code when there is a concrete shared responsibility. Prefer a
  small local helper when it makes the current code easier to understand.
- Use plain functions for self-contained operations with no injected dependencies,
  such as mapping or password hashing. Use Nest injectable providers for operations
  that need injected services or clients; use decorators, pipes, and guards for
  HTTP parameter extraction, validation, and access checks respectively.
- Keep helpers in the owning feature folder with descriptive filenames. Move a
  helper to a shared folder when several features actually need it; avoid a
  catch-all `utils.ts`. Password creation uses `hashPassword()` from
  [`auth/password.ts`](../apps/api/src/auth/password.ts) in both registration and
  staff provisioning, so Argon2 options are defined once. Keep password verification
  with `argon2.verify()`; an extra wrapper is unnecessary for its single caller.
- Choose response mapping placement based on its actual use:
  - Return a short object inline when it is used once. Simple database projections
    can use Prisma `select`.
  - Use a local function when the same mapping is reused within one service.
  - Extract substantial mapping that obscures the operation, or mapping shared by
    several services, into one `<feature>-response.mapper.ts` file with plain
    functions and existing model types.

  Auth's `publicUser()` and `tokenResponse()` remain local; Article shares its
  media mapping between article and media services. A mapper file is optional;
  do not create one for every feature just to match the folder structure.
- Keep the documented public fields explicit rather than returning full database
  records. Response DTOs describe the API contract; they do not serialize results
  automatically. The existing global handlers add the response envelope.
- Inline one-off transformations; do not create helpers for a single `trim()` or
  one short expression. Apply only the normalization required by the feature,
  such as case-insensitive category uniqueness or slug generation. Preserve text
  formatting unless the field's contract requires normalization.
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

### Validation and error conventions

Use the existing NestJS tools and response contract across features:

| Responsibility | Place | Example |
| --- | --- | --- |
| Input type, format, length, and required fields | DTO decorators with the global `ValidationPipe` | Email format, UUID format, title length |
| Authentication and route permissions | Existing guards | Access token and CMS permission |
| Database checks and business rules | Feature service | Cover exists and belongs to the author; password matches |
| Response formatting | Existing global interceptor and exception filter | Success envelope, error envelope, request ID |

- Keep controllers focused on receiving input and delegating. Do not repeat DTO
  validation in every service. Validate normalized values when normalization can
  make otherwise valid input empty or invalid.
- Use [`@CurrentUser()`](../apps/api/src/auth/current-user.decorator.ts) with the
  existing `AuthUser` type when a controller only needs the authenticated user.
  Protect the route with `AccessGuard` and the appropriate role/permission metadata
  at method or controller level. The decorator reads the user attached by the
  guard; it does not authenticate requests. Use `@Req()` when the full request is
  actually needed.
- Validate each feature's data when it is created or updated. For example, profile
  URL rules belong to profile input/provisioning; article publishing checks that
  the author has a profile without revalidating its fields. Keep operation-specific
  checks such as media ownership and HTML sanitization in the article flow.
- Use `fieldValidationException(fields)` from
  [`src/http/validation-exception.ts`](../apps/api/src/http/validation-exception.ts)
  to construct field validation exceptions.
  Both the global DTO validation adapter and service checks should use it to
  return `BadRequestException` with `code: 'VALIDATION_ERROR'`,
  `message: 'Payload Validation Failed'`, and `fields: Record<string, string[]>`.
  Keep feature-specific checks in their feature; share the response construction.
- Field errors identify the request field and a stable uppercase code, such as
  `coverMediaId: ['INVALID_REFERENCE']` or `bodyHtml: ['UNSUPPORTED_HTML']`.
  Use the actual multipart field name for file errors (`file` or `image`). A UUID
  decorator validates format; the service still checks the referenced record and
  ownership. A missing reference in submitted input can be a field error; a
  requested resource that does not exist returns 404.
- Use built-in Nest exceptions for expected failures: 400 for invalid input,
  401 for missing/invalid credentials, 403 for insufficient permission, 404 for a
  missing resource, and 409 for conflicts with current state. A failed login is
  an authentication failure, so it does not need a field validation helper.
- Use `new ConflictException('...')` or another built-in exception with a message
  when the generic status code is enough. Supply `{ code, message }` when clients
  need a distinct action, for example `ACCOUNT_LINK_REQUIRED` or
  `ARTICLE_SLUG_CONFLICT`. Clients should branch on codes, not message text.
  Preserve existing codes and statuses; changing them is an API contract change.
- Validate uploaded files at the upload boundary using Nest file pipes or the
  existing image validation service. Checks of image contents and dimensions
  still belong in the image validation logic. Reuse the same field error format.
- Return plain result data from services and throw exceptions for failures. The
  existing global handlers add the response envelope. Translate known database
  failures near the relevant operation; rethrow unexpected failures so the
  global filter returns a safe 500 response.

The shared field error response remains:

```json
{
  "request_id": "example-request-id",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload Validation Failed",
    "fields": { "coverMediaId": ["INVALID_REFERENCE"] }
  }
}
```

Keep this a small shared helper; no base service, custom exception hierarchy, or
new validation dependency is needed. See Nest's [validation documentation](https://docs.nestjs.com/techniques/validation)
and [file upload documentation](https://docs.nestjs.com/techniques/file-upload).

### Paginated list endpoints

- Define query defaults, numeric conversion, and bounds in a feature query DTO.
  Use the existing `ValidationPipe`, `class-transformer`, and `class-validator`;
  invalid or unknown query fields return the existing field validation errors.
- For lists with numbered pages, use `page` (default 1, range 1–1,000,000) and
  `limit` (default 12, range 1–100). Keep pagination inside the existing envelope:
  `data: { items, pagination: { page, limit, total, totalPages } }`. Count and
  items must use the same filters; read them in one consistent database snapshot
  when both are returned, as with Prisma's `RepeatableRead` transaction.
- Order by a documented field and a unique tie-breaker; articles use
  `publishedAt DESC, id DESC`. Numbered pagination is deterministic for unchanged
  data, but inserts/deletes can shift later pages. Use a separately agreed cursor
  contract if traversal must remain stable across such changes.
- An empty result has `items: []`, `total: 0`, and `totalPages: 0`. A page beyond
  the results returns an empty list with the requested page; do not silently clamp
  it. Select card fields rather than loading body HTML or banner data for lists.
- Document search fields, filter identifiers, combination rules, and publication
  visibility in the feature contract and OpenAPI. Reuse response DTO fields with
  Nest Swagger's mapped types when they describe the same public fields.

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
