# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Releases are cut automatically by semantic-release from conventional commits.

## [Unreleased]

### Added

- Initial SDK: `MailprotectorClient` with fifteen resource classes (`resellers`,
  `customers`, `domains`, `userGroups`, `users`, `managers`, `messages`,
  `allowBlockRules`, `configuration`, `logs`, `statements`, `emailRouting`,
  `userSyncs`, `notificationDestinations`, `results`) covering every documented
  Mailprotector API endpoint.
- Native-fetch `HttpClient` with Bearer auth, token-bucket rate limiting
  (25 req / 5 s), per-request timeout, and exponential-backoff retries
  (network errors, 429 with Retry-After, 5xx).
- Typed error hierarchy: `MailprotectorError` → `AuthenticationError`,
  `ForbiddenError`, `NotFoundError`, `ValidationError`, `RateLimitError`,
  `ServerError`.
- Scope helpers (`scopePath`, `EntityScope` and friends) for the multi-scope
  operations (messages, allow/block rules, logs, configuration, statements,
  email routing).
- Vitest + MSW test suite covering every resource's happy paths plus
  401/404/429 error handling; fixtures drawn from the vendor's documented
  example responses.
