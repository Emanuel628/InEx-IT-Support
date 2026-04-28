# Production Integration Plan

## Purpose

This document defines the **future production integration plan** for InEx IT Support **after** the local-first MVP is complete.

This plan does **not** change the MVP direction.

The local-first console remains the foundation. Live integrations are a later layer added only after the support workflows, data model, and operational vocabulary are stable.

## Non-negotiable rule

Do **not** turn this app into a direct production admin panel first.

The first production-connected version should focus on **safe support context ingestion and read-only lookup**, not unrestricted mutation of InEx Ledger production data.

## Integration goals

Future production integration should make the support console better at answering:

- Which real InEx Ledger user is affected?
- Which real business is affected?
- Which subscription state is currently active?
- Which release or deploy likely caused the issue?
- Which real error/event/log record maps to this support case?
- What support context can be pulled automatically instead of being typed manually?

## Explicitly deferred for later

Do not add these first:

- full RBAC
- generic office IT workflows
- direct ledger mutation
- direct financial transaction editing
- broad production write access
- customer-facing portal behavior
- AI triage features
- real-time notifications

## Guiding principles

### 1. Read before write

The first live integrations should favor:

- read-only user lookup
- read-only business lookup
- read-only subscription lookup
- read-only release metadata lookup
- read-only error/event lookup

If write actions are added later, they should be narrow, explicit, and auditable.

### 2. Keep support records separate from production records

Production records and support records should not become the same thing.

Support records should remain support-side operational objects with:

- notes
- linked cases
- linked incidents
- linked resolutions
- linked knowledge
- support-specific activity

Production integrations should enrich support records, not replace them.

### 3. Preserve auditability

Every production-connected read, import, sync, or write should eventually create activity records showing:

- what was looked up or changed
- when it happened
- who triggered it
- which entity it affected
- whether it was read-only or mutating

### 4. Add integrations in narrow layers

Do not connect everything at once.

Each integration should land as an isolated layer with:

- a clear source of truth
- a clearly limited scope
- a rollback path
- visible support value

## Recommended rollout order

## Phase 17A — Read-only user and business lookup

### Goal

Let support attach real production context to local support records.

### Add first

- user lookup by email or user id
- business lookup by business id or owner user id
- plan / subscription summary display
- region / language / verification state display

### MVP-safe behavior

- read only
- no production mutation
- manual attach or refresh actions
- clear “last synced” timestamp

### Good outcomes

- faster ticket enrichment
- less manual typing
- better business/account context

## Phase 17B — Subscription and billing context

### Goal

Make billing/support cases easier to diagnose.

### Add first

- read-only subscription status lookup
- active plan lookup
- cancellation state lookup
- additional business slot summary
- billing mismatch flags for support visibility

### Avoid first

- plan changes
- refunds
- subscription cancellation from support UI
- invoice mutation

### Good outcomes

- billing tickets can be triaged faster
- support can verify current account state without guessing

## Phase 17C — Error and event ingestion

### Goal

Reduce manual logging of technical issues.

### Add first

- error ingestion endpoint
- deploy metadata import
- app event / audit log ingestion
- receipt/export/auth failure ingestion
- structured source tagging

### Desired behavior

- create or update error records safely
- deduplicate recurring technical failures
- link ingested errors to releases and incidents where possible

### Good outcomes

- better technical visibility
- less manual copy/paste from logs
- recurring issue detection becomes stronger

## Phase 17D — Contact-form and support-intake ingestion

### Goal

Create tickets automatically from real intake sources.

### Add first

- contact-form ticket intake
- optional email-to-ticket planning only after structured intake is stable
- basic source labeling for imported tickets

### Desired behavior

- manual review still remains possible
- imported tickets clearly identify their origin
- duplicate suppression rules can be added later

### Good outcomes

- lower manual intake overhead
- faster response for customer-reported issues

## Phase 17E — Release and deploy metadata sync

### Goal

Make release troubleshooting more accurate.

### Add first

- import deploy timestamp
- import commit SHA
- import environment
- import migration flag
- import release notes summary

### Good outcomes

- support can correlate incidents/errors with actual deploys
- release records become less manual

## Phase 17F — Carefully scoped support actions

### Goal

Only after read-only context is stable, allow narrow production-safe actions.

### Candidate actions later

- resend verification email
- trigger a safe support-side recheck or refresh
- retry a failed non-financial workflow when explicitly supported by backend rules

### Rules

- explicit confirmation required
- narrow backend endpoints only
- activity logging mandatory
- no direct ledger editing
- no broad admin write surface

## Architecture recommendation

### Keep the current local-first model

Do not rip out the local-first architecture.

Instead, add a production integration layer like this:

- local support stores remain the UI working layer
- sync/adaptor services pull selected production context
- imported context is mapped into support-side records
- activity logs capture sync/import actions

### Suggested layers

- `services/productionLookupService`
- `services/billingLookupService`
- `services/errorIngestionService`
- `services/releaseSyncService`
- `services/contactIntakeService`

### Suggested UI behavior

Use explicit actions like:

- Refresh Production Context
- Pull Latest Subscription State
- Sync Release Metadata
- Import Recent Errors

Avoid hidden background mutation for the first production-connected version.

## Security and safety boundaries

### Required safeguards

- environment-based integration toggles
- server-side auth for integration endpoints
- rate limiting
- clear read/write separation
- explicit activity logging
- error handling that fails closed
- visible sync timestamps
- minimal returned payloads

### Strong recommendation

Use a backend proxy owned by InEx Ledger for production lookups.

Do not let the front end call sensitive production services directly.

## Data ownership model

### Production remains source of truth for

- real users
- real businesses
- real subscriptions
- real deploy metadata
- real application events

### InEx IT Support remains source of truth for

- support notes
- support tickets
- support incidents
- support resolutions
- support knowledge articles
- support workflow activity
- local backups / exports

## Readiness checklist before first production connection

Do not start production integration until all are true:

- local-first MVP workflows are stable
- support vocabulary is stable enough to map real data into it
- ticket, error, incident, and release flows are already usable without integrations
- activity logging is trusted
- data import/export/backup flows are working
- backend integration surface is intentionally scoped

## First recommended implementation slice

If only one production-connected slice is added first, do this:

1. read-only user lookup
2. read-only business lookup
3. read-only subscription summary
4. attach/sync production context into user/business detail views
5. log sync activity into global activity

This gives the highest support value with the lowest operational risk.

## Final recommendation

Treat production integration as **context enrichment**, not as permission to turn the app into a full admin console.

The safest next version of InEx IT Support is:

- local-first at the UI layer
- selectively production-aware
- read-heavy first
- tightly audited
- narrow in write capability

That path preserves the value of the MVP while still making the app much more useful in real support operations.
