# Error and Event Ingestion Plan

## Purpose

This document narrows Phase 17C into a future implementation slice for automatic error and event ingestion.

The goal is to reduce manual technical error entry while keeping the support console readable, auditable, and support-focused.

## Why this matters

The current MVP supports manual error logging well, but production use will benefit from structured ingestion of technical failures and event context.

This helps support answer:

- Is this a new error or a recurring one?
- Which release likely caused it?
- Is this already tied to an incident?
- How often is it happening?
- Which app area is failing most often?

## Scope

### In scope

- structured error ingestion
- recurring error deduplication planning
- deploy metadata correlation
- event source labeling
- link suggestions to releases and incidents
- read-only import behavior into support-side error records
- activity logging for imports and syncs

### Out of scope

- arbitrary log streaming into the browser
- unrestricted production log browsing
- mutation of production systems from the support UI
- direct shell access or infrastructure control from this app

## Recommended sources later

Future ingestion sources may include:

- frontend console failures
- backend or API failures
- deploy or build metadata
- export failures
- auth failures
- receipt-processing failures
- worker or background job failures

## Recommended behavior

### Ingestion layer

A backend ingestion layer should:

- normalize incoming events
- assign source labels
- map events to app areas
- identify candidate duplicates
- attach release identifiers when possible
- store enough context for support without flooding the UI

### Support-side result

InEx IT Support should receive support-usable records such as:

- title
- message summary
- source
- environment
- app area
- severity
- first seen
- last seen
- occurrence count
- linked release id
- linked incident id if known

## Deduplication guidance

Recurring issues should not blindly create infinite new records.

A future ingestion pipeline should try to group events by a stable fingerprint using factors like:

- source
- normalized message pattern
- app area
- environment
- release context where relevant

The support UI should still preserve clear first-seen and last-seen timestamps and an occurrence count.

## Release and incident linkage

Imported errors should be easy to correlate to:

- releases
- active incidents
- future resolutions

The goal is not perfect automatic linkage on day one.

The goal is to give support a useful starting point with safe, explainable link suggestions.

## Activity logging requirements

Each import or sync action should create activity records like:

- Recent errors were imported
- Error records were synced from production events
- Error recurrence counts were refreshed

Metadata should include:

- source type
- import count
- deduped count
- linked release count where available

## Security and safety rules

- ingestion should go through a backend service
- the support UI should not receive raw unrestricted infrastructure access
- imported payloads should be narrowed to support-relevant fields
- secrets and sensitive internals must remain outside the front end
- all ingest or sync jobs should be traceable

## Definition of done for this slice

This slice is done when:

- technical failures can be imported into the support console safely
- duplicate recurring failures can be grouped reasonably
- imported errors can surface release and incident context when available
- sync/import actions are logged in global activity
- the UI stays support-focused instead of becoming a raw log browser
