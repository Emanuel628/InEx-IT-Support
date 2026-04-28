# InEx IT Support — Backend, Security, Auth, and API Build Plan

## Status

This document is the **new active build plan** after the local-first MVP was completed.

The earlier scaffold-first/local-first build plan is finished and should now be treated as completed reference material.

This new plan covers the next implementation chapter:

1. backend architecture
2. auth and roles
3. database and migrations
4. production read integrations
5. testing and deployment hardening

## Product direction for this phase

InEx IT Support remains the internal support console for InEx Ledger.

What changes now is the system foundation.

The next version stops being only a local-first MVP and becomes a real application with:

- backend persistence
- authentication
- authorization
- audit-safe identity
- database migrations
- production-aware context lookup
- deployment hardening

This phase still should **not** turn the app into a broad production admin panel.

## Non-negotiable rules

### Keep support data separate from ledger production data

Support-side records must remain their own system of record for:

- support tickets
- support incidents
- support notes
- support resolutions
- support knowledge
- support activity

Production integrations should enrich support records, not replace them.

### Read before write

The first production-connected version should be read-heavy.

Safe lookups should come before any narrowly scoped support action.

### Backend first

Do not bolt auth or production integration directly into the frontend.

The next version needs a real backend/API before security and integrations can be trusted.

## Section 1 — Backend architecture

## Goal

Create the first real backend foundation for InEx IT Support.

## Required components

- API service
- Postgres database
- environment configuration
- validation layer
- persistence layer
- audit logging foundation

## Recommended hosting shape

Preferred structure:

- separate Railway project for InEx IT Support
- separate Postgres for InEx IT Support
- separate API service for InEx IT Support

A second Postgres inside the existing Railway project is technically valid, but a separate project is cleaner long-term.

## Recommended architecture

### Frontend

- React
- Vite
- TypeScript

### Backend

- Node.js
- Express or equivalent minimal server framework
- TypeScript preferred if adopted now, but a disciplined JavaScript backend is acceptable if kept consistent

### Database

- PostgreSQL

### Backend layers

Suggested backend structure:

- `src/server`
- `src/routes`
- `src/controllers`
- `src/services`
- `src/repositories`
- `src/middleware`
- `src/lib`
- `src/db`
- `src/db/migrations`

### Initial backend domains

- auth
- users
- businesses
- tickets
- errors
- incidents
- knowledge
- resolutions
- releases
- activity
- settings
- backups or export metadata if needed later

## Section 2 — Auth and roles

## Goal

Add real sign-in, identity, and permission boundaries.

## Company ID requirement

Users should be able to sign in with a **company ID**.

Yes, that means the system needs a stable ID model for accounts.

## Recommended identity model

Use two different identifiers:

### 1. Internal database user id

This is the immutable primary key in the database.

Recommended form:

- UUID

Purpose:

- joins
- foreign keys
- audit history
- internal record ownership

This should never change.

### 2. Human-facing company ID

This is the sign-in-friendly and support-visible identifier.

Recommended form:

- `CMP-USER-000001`
- or shorter like `IU-000001`

Purpose:

- sign-in
- technician identity
- admin lookup
- audit visibility in the support UI

This should also remain stable once issued.

## Important rule

Do **not** use the human-facing company ID as the database primary key.

Use:

- UUID for the real database identity
- company ID as a unique public/internal login identifier

## Why this matters

You said the ID should follow the work the user has done.

That is correct.

The stable database user id should anchor:

- created tickets
- ticket updates
- assignments
- incident notes
- resolutions
- activity records
- future audit logs

The company ID can be what humans use to sign in and recognize the account, but the UUID should anchor the relational data model.

## Required auth capabilities

- login with company ID
- password-based sign-in initially
- secure password hashing
- session or token auth
- protected routes
- logout
- current-user endpoint
- disabled or inactive account support later

## Roles to add first

Start simple.

Recommended initial roles:

- `admin`
- `support_manager`
- `support_agent`
- `viewer`

## Initial permission model

### admin

- full support-system access
- settings access
- team management access
- future integration configuration access

### support_manager

- manage tickets/errors/incidents/resolutions/releases
- view reports/activity/settings
- manage assignment and workflow state

### support_agent

- work tickets/errors/incidents
- add notes and resolutions
- use support workflows
- limited settings visibility if needed

### viewer

- read-only access to operational views

## Auth safety requirements

- hashed passwords
- rate limiting on login
- lockout or cooldown planning later
- secure secret handling
- server-side authorization checks
- no frontend-only role enforcement

## Section 3 — Database and migrations

## Goal

Replace local-only persistence with a real database-backed support system.

## Required database work

- initial schema design
- migrations folder
- migration runner
- seed data strategy for dev and staging
- repositories or data-access layer

## Core tables

First-pass tables should include:

- users
- businesses
- support_users
- support_businesses
- tickets
- ticket_activity
- errors
- incidents
- knowledge_articles
- resolutions
- releases
- activity_log
- settings
- auth_sessions or refresh tokens if used

Depending on normalization choices, some support-side user/business tables may be merged or renamed, but the support-side context should remain distinct from production ledger data.

## Company ID generation requirement

Yes, you will need a company ID generator when a new internal support account is created.

## Recommended approach

When a new account is created:

1. generate a UUID primary key
2. generate the next company ID from a database-backed sequence
3. store both

Example:

- `id = 550e8400-e29b-41d4-a716-446655440000`
- `company_id = IU-000127`

## Why database-backed generation matters

Do not generate these IDs only in the frontend.

The backend should own company ID generation so it is:

- unique
- sequential or structured consistently
- race-safe
- auditable

## Migration requirements

- migration 001: initial schema
- migration 002: role and auth structures if separated
- migration 003: activity log hardening
- migration 004+: future integration support fields

## Must-have migration rules

- every schema change must be versioned
- no manual production-only schema edits
- dev/staging/prod must use the same migration history

## Section 4 — Production read integrations

## Goal

Make InEx IT Support production-aware without turning it into a broad admin console.

## First integration slice

Start with read-only lookup for:

- user context
- business context
- subscription context

## Future read integrations

- user lookup by company/system identifiers
- business/account lookup
- subscription summary lookup
- release/deploy metadata sync
- error and event ingestion
- contact-form intake ingestion

## Integration rules

- all production access goes through backend endpoints
- no direct frontend secrets
- no direct frontend access to sensitive services
- read-only first
- sync activity must be logged
- show last synced timestamps

## UI behavior guidance

Future buttons should be explicit, for example:

- Refresh Production User Context
- Refresh Business Context
- Pull Subscription Summary
- Sync Release Metadata
- Import Recent Errors

Do not add hidden background mutation as the first production-connected behavior.

## Section 5 — Testing and deployment hardening

## Goal

Make the next version safe to deploy and maintain.

## Must-have testing layers

### Backend tests

- auth tests
- permission tests
- route validation tests
- repository/service tests
- migration smoke tests

### Frontend tests

- route protection behavior
- authenticated workflow smoke tests
- critical form submission tests

### Integration tests

- login flow
- current-user flow
- protected API access
- support record CRUD against backend

## Deployment requirements

- environment separation for local/staging/production
- backend env validation at boot
- database connection checks
- migration run strategy during deploy
- safe rollback plan
- logging and monitoring

## Security hardening checklist

- secret management
- auth token/session hardening
- rate limiting
- CORS policy
- request validation
- audit logging
- role enforcement
- production-safe error responses

## Phase-by-phase implementation order

## Phase A — Backend skeleton

Build:

- API service scaffold
- health endpoint
- env validation
- DB connection layer
- migration runner scaffold

Completion point:

Backend boots cleanly and can connect to Postgres safely.

## Phase B — Auth and company ID accounts

Build:

- users table for internal support accounts
- company ID generator
- account creation flow
- password hashing
- login with company ID
- current-user endpoint
- logout/session handling
- role field

Completion point:

Internal users can sign in securely using company ID and the system can identify them reliably.

## Phase C — Protected support API

Build:

- protected CRUD endpoints for support entities
- role checks
- audit logging hooks
- server-side validation

Completion point:

The app can persist support-side records in Postgres with real identity and authorization checks.

## Phase D — Migrations and dev/staging seeding

Build:

- migration files
- seed flow for non-production environments
- consistent environment bootstrapping

Completion point:

The database layer is reproducible and versioned.

## Phase E — First production read integrations

Build:

- read-only user lookup
- read-only business lookup
- read-only subscription summary lookup
- sync logging into activity

Completion point:

Support records can be enriched safely with production context.

## Phase F — Testing and deployment hardening

Build:

- test coverage for auth and core workflows
- deployment checks
- monitoring/logging basics
- rollback and failure handling

Completion point:

The backend-connected version is safe enough for staged internal use.

## Acceptance criteria for this whole plan

This new plan is complete when:

- InEx IT Support has a real backend
- support accounts can sign in with company ID
- user identity persists across all authored work and audit history
- Postgres is the real persistence layer
- migrations exist and are reproducible
- role-based permissions exist
- the first production read integrations are available safely
- testing and deployment hardening are in place

## Final rule

Do not collapse this into one giant leap.

The correct order is:

1. backend architecture
2. auth and roles
3. database and migrations
4. production read integrations
5. testing and deployment hardening

That order protects the product from becoming a risky half-secure admin panel.
