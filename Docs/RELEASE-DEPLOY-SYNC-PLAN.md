# Release and Deploy Sync Plan

## Purpose

This document narrows the future release and deploy metadata sync slice into a concrete plan for improving release troubleshooting inside InEx IT Support.

The goal is to reduce manual release entry and improve correlation between deploys, incidents, and technical errors.

## Why this matters

Support often needs to answer:

- What changed recently?
- Which deploy likely caused this issue?
- Did this release include migrations?
- Was this problem introduced in production, staging, or both?

The current MVP already models releases well. A future production-connected version should enrich that workflow with real deploy metadata.

## Scope

### In scope

- release metadata import
- deploy timestamp sync
- commit SHA sync
- environment sync
- migration flag sync
- release summary or notes sync
- link support-side releases to real deploy context
- activity logging for release syncs

### Out of scope

- direct deployment from the support UI
- rollback execution from the support UI
- unrestricted CI/CD administration
- infrastructure control from the support console

## Recommended imported fields

A future synced release record should aim to include:

- release identifier
- deploy timestamp
- commit SHA
- environment
- migration included flag
- release summary
- changed areas summary if available
- known risk notes if available
- sync timestamp

## Recommended behavior

### Release workflow

A future sync should:

- pull recent deploy metadata from a backend integration layer
- normalize the deploy record into support-side release shape
- create or update the local support-side release record
- link relevant errors and incidents when clear correlations exist
- log the sync action in global activity

### Support-side usage

Synced release records should remain support-focused.

They should help support understand release context without turning the support UI into a CI/CD control surface.

## Correlation guidance

Release sync becomes most valuable when it helps support correlate:

- active incidents
- recurring technical errors
- billing or export regressions
- auth or deploy-related failures

The first version should favor visible correlation hints over aggressive automatic assumptions.

## UI recommendations

### Release detail page

Future synced releases should show:

- synced deploy timestamp
- synced commit SHA
- environment
- migration state
- last synced at
- source of deploy metadata

### Dashboard and reports

Release-aware reporting should help surface:

- recent deploys
- issues linked to recent deploys
- incident clusters around release windows

## Activity logging requirements

Each sync should create activity such as:

- Release metadata was synced
- Recent deploys were imported
- Incident was linked to a release context refresh

Metadata should include:

- environment
- release id
- commit SHA if available
- sync result state

## Security and safety rules

- deploy metadata should come through a backend service
- support UI should not directly control deployments
- read-only metadata sync should come before any action planning
- all syncs should be auditable

## Definition of done for this slice

This slice is done when:

- release records can be enriched with real deploy metadata
- release detail shows synced deploy context clearly
- support can correlate errors and incidents against recent releases more accurately
- sync actions are logged in global activity
