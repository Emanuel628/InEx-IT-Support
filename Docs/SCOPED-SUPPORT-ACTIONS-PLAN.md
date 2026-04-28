# Scoped Support Actions Plan

## Purpose

This document narrows the future support-actions slice into a concrete plan for carefully scoped production-connected actions.

These actions are intentionally **later** than read-only integrations.

The goal is to allow a very small set of safe support-side operations only after read-heavy production context features are stable.

## Why this is later

Read-only context should come before write actions.

Support should first be able to:

- identify the right user
- identify the right business
- understand billing state
- correlate issues with errors and releases

Only after that foundation is trustworthy should the app expose any production-connected actions.

## Scope

### In scope later

- safe re-send actions
- safe refresh or recheck actions
- narrowly scoped retry actions for explicitly supported workflows
- confirmation-gated support actions
- strong activity logging for every action

### Out of scope

- direct ledger editing
- broad admin mutation
- financial transaction edits
- unrestricted user or subscription mutation
- deployment control
- infrastructure control
- anything without a backend-owned safety boundary

## Candidate actions later

Examples of acceptable future actions may include:

- resend verification email
- trigger a safe account-state refresh
- retry a failed non-financial support-safe workflow when backend support exists
- request a controlled recheck of receipt/export/auth status

These are only examples. Each action must still pass a safety review before implementation.

## Required product rules

Every future support action should require:

- explicit user intent
- clear confirmation
- a narrow backend endpoint
- activity logging
- a visible result state
- safe error handling

## UX guidance

### Action placement

Actions should live only on the detail pages where the context is clear, such as:

- user detail
- business detail
- ticket detail
- release detail if a safe refresh action exists later

### Confirmation behavior

The UI should make it obvious:

- what action is being triggered
- which record is affected
- whether the action is read-only or mutating
- what the expected result is

## Activity logging requirements

Every action must create activity records such as:

- Verification email was re-sent from support
- Account status refresh was triggered from a business detail page
- Safe retry action was requested for a support-linked workflow

Metadata should include:

- target entity
- action type
- actor
- result state
- backend correlation id if available

## Backend requirements

Future support actions must be backed by endpoints that are:

- intentionally narrow
- permission-checked
- rate-limited
- auditable
- environment-aware
- fail-closed on error

## Security boundaries

The support UI must never become a broad production admin console.

Each action must be individually justified.

A good test is:

- does this help support resolve or verify a case faster?
- is the action narrow enough to be safe?
- can it be fully audited?
- can it be removed or disabled cleanly if needed?

If the answer is not clearly yes, the action should not ship.

## Definition of done for this slice

This slice is done when:

- a very small set of justified support-safe actions exists
- each action is narrow and confirmation-gated
- each action is backed by a backend-owned safety boundary
- every action is logged in activity
- the app still behaves like a support console, not a broad admin surface
