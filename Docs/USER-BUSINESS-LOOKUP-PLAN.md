# User and Business Lookup Plan

## Purpose

This document narrows Phase 17A into a concrete future implementation slice for read-only user and business lookup.

This is the recommended first production-connected feature for InEx IT Support.

## Why this goes first

This slice has the best risk-to-value ratio because it gives support immediate real-account context without introducing broad production mutation.

It helps answer:

- Is this the correct real user?
- Which real business owns the issue?
- What plan or subscription state is attached?
- Is the account verified, active, or in a mismatch state?

## Scope

### In scope

- lookup by user id
- lookup by email
- lookup by business id
- lookup by owner user id
- read-only account summary
- read-only business summary
- read-only subscription summary snapshot
- attach production context into local support records
- sync timestamps
- activity logging for lookups and syncs

### Out of scope

- editing users
- editing businesses
- changing subscriptions
- changing business limits
- changing verification state
- changing language or region
- impersonation

## Recommended UI entry points

### User detail page

Add future actions such as:

- Find Production User
- Refresh Production User Context
- Pull Business Context

### Business detail page

Add future actions such as:

- Find Production Business
- Refresh Production Business Context
- Pull Owner Account Summary
- Pull Subscription Summary

## Frontend behavior

### User detail

A future production sync should enrich the local user view with a production context section showing:

- production user id
- email
- verification state
- linked business id
- region
- language
- last synced at

### Business detail

A future production sync should enrich the local business view with:

- production business id
- owner user id
- plan name
- subscription status
- additional business slots
- region
- language
- last synced at

## Local record model recommendation

Do not replace the current local support-side record.

Instead, add a nested production context block later for synced user and business information.

## Activity logging requirements

Each lookup or sync should create activity records like:

- Production user lookup was run for a support-side user record
- Business context was refreshed for a support-side business record
- Subscription summary was synced into a business support record

Metadata should include:

- lookup type
- production id if found
- sync mode
- result state

## Error handling

### Expected safe states

- not found
- partial match
- lookup unavailable
- rate limited
- backend auth failure

### UI behavior

- show a clear status banner
- do not wipe local support data if lookup fails
- preserve last successful synced context until replaced

## Security rules

- backend-only production access
- no direct frontend secrets
- least-privilege service account
- read-only access first
- rate limiting required
- audit log required

## Definition of done for this slice

This slice is done when:

- support can search real users and businesses safely
- user and business detail pages can show production context
- subscription summary is visible read-only
- local support records remain separate from production records
- all sync actions are logged in activity
