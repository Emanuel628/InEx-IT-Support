# Support Intake Ingestion Plan

## Purpose

This document narrows the future support-intake slice into a concrete plan for bringing real support requests into InEx IT Support automatically.

The goal is to reduce manual ticket entry without losing support-side control, reviewability, or auditability.

## Why this matters

Right now the MVP handles manual ticket creation well.

A future connected version should also support intake from real sources so the team does not have to retype customer issues into the console.

This helps with:

- faster ticket intake
- more consistent source attribution
- less manual copy/paste
- better tracking of where support requests came from

## Scope

### In scope

- contact-form ticket ingestion
- source labeling for imported tickets
- support-side reviewable imported tickets
- duplicate suppression planning
- activity logging for imports

### Out of scope

- customer-facing portal redesign
- broad email automation as the first intake channel
- auto-replies from this app
- direct CRM replacement
- automatic mutation of production user or billing data during intake

## Recommended rollout order

### First intake source

Start with the most structured source first:

- contact-form submissions

This is safer than jumping straight into noisy free-form email ingestion.

### Later intake source

Only after structured intake is stable, plan for:

- email-to-ticket ingestion

## Recommended behavior

### Intake flow

A future intake pipeline should:

- receive the incoming support payload
- normalize the fields
- label the source clearly
- create a support-side ticket record
- preserve original intake text
- optionally attempt safe user/business matching
- log the intake action in activity

### Imported ticket behavior

Imported tickets should still behave like normal support-side tickets after creation.

They should be editable, triageable, linkable, and auditable in the same way as manually created tickets.

## Recommended imported fields

Imported tickets should try to populate:

- requester name
- requester email
- business name if supplied
- source
- title or subject
- details/body
- created timestamp
- imported-from marker
- original intake payload summary or excerpt

## Source labeling

Imported tickets should clearly show where they came from, such as:

- contact_form
- email
- internal
- manual

The imported source should remain visible in ticket detail and reports.

## Duplicate suppression guidance

A future intake layer should try to avoid creating unnecessary duplicate tickets when the same issue is submitted repeatedly.

Good candidate signals include:

- requester email
- normalized subject/title
- business identifier
- time proximity
- matching unresolved ticket context

However, duplicate suppression should remain conservative at first.

The safer first step is to surface duplicate warnings or candidate matches rather than aggressively merging records automatically.

## UI recommendations

### Ticket detail

Imported tickets should show:

- intake source
- original import timestamp
- original intake summary or payload excerpt

### Dashboard and reports

Imported tickets should contribute to:

- source-based ticket counts
- intake-volume visibility
- recent imported activity

## Activity logging requirements

Each import should create activity such as:

- Ticket was imported from contact form
- Intake payload created a new support ticket
- Intake record matched an existing business support context

Metadata should include:

- source
- imported ticket id
- requester email if available
- duplicate-match state if checked

## Security and safety rules

- intake must pass through a backend service
- sanitize imported content
- preserve clear source labeling
- do not trust imported payloads as authoritative production truth
- log all automated imports

## Definition of done for this slice

This slice is done when:

- structured support requests can create support-side tickets automatically
- imported tickets remain reviewable and editable
- intake source is visible in the UI
- imports are logged in activity
- duplicate handling is safe and conservative
