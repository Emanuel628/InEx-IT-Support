# Billing and Subscription Context Plan

## Purpose

This document narrows Phase 17B into a future implementation slice for read-only billing and subscription context inside InEx IT Support.

The goal is to make billing-related tickets easier to diagnose without turning the support console into a billing admin panel.

## Why this matters

Many support cases depend on understanding account state rather than changing it.

Support often needs to know:

- whether the subscription is active
- which plan is attached
- whether cancellation is pending
- whether business limits are causing confusion
- whether the support issue is actually a billing-state mismatch

## Scope

### In scope

- read-only subscription status
- read-only plan name
- read-only cancellation state
- read-only renewal or expiration summary
- read-only additional business slot summary
- billing mismatch indicators for support visibility
- sync timestamps
- activity logging for billing context refreshes

### Out of scope

- changing plans
- issuing refunds
- canceling subscriptions
- editing invoices
- editing payment methods
- granting credits from the support UI

## Recommended UI placement

### Business detail page

Future billing context should appear as a support-side section with:

- plan name
- subscription status
- cancellation state
- next renewal or expiration summary
- additional business slot count
- last synced at

### Ticket detail page

For billing-related tickets, show a compact linked billing summary if a business is attached.

## Good support outcomes

- support can confirm whether the issue is billing-related quickly
- billing confusion can be separated from product bugs faster
- fewer manual checks are needed outside the support console

## Activity logging requirements

Each billing refresh should create activity records such as:

- Billing context was refreshed for a business support record
- Subscription summary was synced into a linked ticket context

Metadata should include:

- business id
- result state
- subscription status
- plan name if available

## Security and safety rules

- read-only first
- backend proxy only
- no direct payment or billing mutation from this app
- least-privilege integration access
- all refresh actions logged

## Definition of done for this slice

This slice is done when:

- support can see reliable read-only billing context in business support workflows
- billing-related tickets can surface linked account-state context
- billing lookups are logged in activity
- no billing mutation is exposed in the UI
