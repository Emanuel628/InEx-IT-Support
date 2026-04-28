# InEx IT Support — Complete Build Plan

## 1. Product Decision

**InEx IT Support is the internal help desk, error log desk, incident desk, and resolution desk for InEx Ledger 2.0.**

This is not a generic office IT helpdesk. It is not primarily for laptops, printers, Microsoft 365 access, or hardware inventory. It is the support-side application for the InEx Ledger product.

The app exists so one person or a small support team can track:

- Customer support tickets
- Internal product bugs
- App errors
- API failures
- Billing problems
- Receipt upload issues
- Export/PDF problems
- Authentication problems
- Business/user account problems
- Deployment regressions
- Database/migration issues
- Known incidents
- Final resolutions
- Reusable troubleshooting knowledge
- Support activity history
- Local backups and exported support data

The app should answer these questions quickly:

- Who needs help?
- Which InEx Ledger user is affected?
- Which business/account is affected?
- What app area is broken?
- Is this a customer support issue, technical error, or larger incident?
- Is there a known workaround?
- Has this happened before?
- What fixed it last time?
- Which release/deployment may have caused it?
- What is the next support action?

## 2. Build Philosophy

This project must be built scaffold-first.

The correct order is:

1. Complete the full app scaffold and route map.
2. Lock the page identities and navigation.
3. Create shared layout components.
4. Create TypeScript models.
5. Add InEx Ledger-specific mock data.
6. Wire localStorage stores.
7. Add filtering, search, details, and CRUD.
8. Add exports/imports/backups.
9. Only later consider live integration with InEx Ledger production APIs.

Do not jump into backend, auth, database, or live production integrations until the local-first scaffold and workflows are complete.

This app should stay local-first for the MVP.

## 3. Non-Negotiable Scope Rules

### Build this

- Dashboard
- Tickets
- Errors
- Incidents
- Users
- Businesses
- Knowledge Base
- Resolutions
- Releases
- Reports
- Activity
- Data
- Backups
- Settings

### Do not build yet

- Full backend API
- Production database
- Multi-user authentication
- Role-based access control
- Email ingestion
- Real-time notifications
- Customer-facing support portal
- Direct mutation of InEx Ledger production records
- Direct financial ledger access
- AI bot features
- Complex analytics
- CRM functionality

### Do not drift into generic IT support

Avoid generic examples like:

- Printer queue stuck
- Laptop Wi-Fi issue
- Outlook crashing
- Mouse and keyboard disconnecting
- New hire Microsoft 365 access

Use InEx Ledger support examples instead:

- Email verification not received
- User cannot log in
- Business context missing
- Transactions not saving
- Categories not loading
- Receipt upload returns 500
- PDF export failed
- Export public key unavailable
- Stripe checkout says already subscribed
- Subscription canceled but still active until period end
- Additional business slot billing mismatch
- Railway health check failed
- Migration failed because of SQL BOM
- PDF worker missing environment variables

## 4. Final Navigation Model

The app should use this final navigation structure:

### Support

- Dashboard
- Tickets
- Errors
- Incidents

### Product Context

- Users
- Businesses
- Knowledge Base
- Resolutions
- Releases

### Operations

- Reports
- Activity
- Data
- Backups
- Settings

If the sidebar remains a single flat list for the first scaffold pass, use this order:

1. Dashboard
2. Tickets
3. Errors
4. Incidents
5. Users
6. Businesses
7. Knowledge Base
8. Resolutions
9. Releases
10. Reports
11. Activity
12. Data
13. Backups
14. Settings

## 5. Page Definitions

### Dashboard

Purpose:

The daily command center. It shows what needs attention right now.

Must show eventually:

- Open tickets
- Critical tickets
- Waiting on user
- Escalated tickets
- Active incidents
- New errors
- Recently resolved items
- My queue
- Recently updated tickets
- Recent activity
- Common issue categories
- Quick create ticket

### Tickets

Purpose:

The help desk. Tickets are human-facing support requests or manually created support tasks.

A ticket means:

A person, customer, user, or technician needs help or follow-up.

Tickets may link to:

- User
- Business
- Error
- Incident
- Resolution
- Release
- Knowledge Base article

### Errors

Purpose:

The technical error log desk.

An error means:

The system produced a technical failure, exception, bad API response, console error, webhook failure, deploy failure, or recurring system problem.

Errors are not the same as tickets. A ticket may be created because of an error, and an error may affect many tickets.

### Incidents

Purpose:

Track larger problems affecting multiple users, one major system area, or production reliability.

An incident is bigger than one support ticket.

Examples:

- PDF exports failing for all users
- Stripe checkout broken for active subscribers
- Receipt uploads returning 500
- Email verification not sending
- Railway health check failing after deploy
- Database migration broke categories/accounts

### Users

Purpose:

Support-side user/customer profiles.

This is not the production users table yet. For the local-first MVP, it stores support snapshots and notes.

### Businesses

Purpose:

Support-side business/account profiles for InEx Ledger customers.

This replaces the generic idea of hardware/assets for the MVP.

A business is the key support context in InEx Ledger because most app records are scoped through business_id.

### Knowledge Base

Purpose:

Reusable troubleshooting articles, support procedures, customer response templates, and internal playbooks.

Knowledge Base articles are general reusable guidance.

### Resolutions

Purpose:

Historical records of what fixed a real problem.

A resolution is not the same as a Knowledge Base article.

A resolution says:

- This was the problem.
- This was the root cause.
- This is exactly what fixed it.
- This is how it was verified.

Resolutions can later be converted into Knowledge Base articles.

### Releases

Purpose:

Track product changes, deploys, migrations, and known risks.

Support often needs to know what changed recently.

A release may link to tickets, errors, incidents, and resolutions.

### Reports

Purpose:

Show support load, recurring patterns, issue categories, and operational visibility.

Reports should be table-first and useful before adding charts.

### Activity

Purpose:

Global audit trail of support-side actions.

Activity includes ticket changes, error logs, incident changes, resolution additions, KB updates, imports, exports, backups, and settings changes.

### Data

Purpose:

Import/export/reset local-first support data.

### Backups

Purpose:

Create, restore, and inspect local backup snapshots.

### Settings

Purpose:

Control support workflow vocabulary and local preferences.

Settings should eventually drive dropdown options in forms.

## 6. Data Models

These models should be created before wiring major functionality.

### TicketRecord

Required fields:

- id
- title
- requesterName
- requesterEmail
- businessName
- relatedBusinessId
- relatedUserId
- status
- priority
- severity
- category
- source
- environment
- appArea
- assignedTech
- createdAt
- updatedAt
- dueAt
- details
- reproductionSteps
- expectedResult
- actualResult
- workaround
- relatedReleaseId
- relatedErrorIds
- relatedIncidentId
- relatedResolutionId
- relatedKnowledgeArticleIds
- tags
- activity

Statuses:

- new
- in_progress
- waiting_on_user
- escalated
- resolved
- archived

Priorities:

- low
- medium
- high
- critical

Severities:

- minor
- major
- critical

Sources:

- manual
- email
- contact_form
- internal
- error_log
- incident

Categories:

- bug
- billing
- exports
- receipts
- authentication
- data_integrity
- ui_ux
- feature_request
- infrastructure
- account_access
- business_context
- deployment

App areas:

- auth
- transactions
- accounts
- categories
- receipts
- exports
- billing
- settings
- dashboard
- onboarding
- email
- database
- api
- frontend
- deployment
- unknown

Environments:

- production
- staging
- local
- development

### ErrorLogRecord

Required fields:

- id
- title
- message
- rawLog
- stackTrace
- source
- environment
- appArea
- severity
- status
- firstSeenAt
- lastSeenAt
- occurrenceCount
- affectedUserId
- affectedBusinessId
- relatedTicketIds
- relatedIncidentId
- relatedResolutionId
- relatedReleaseId
- notes
- tags
- createdAt
- updatedAt

Statuses:

- new
- triaged
- linked_to_ticket
- investigating
- fixed
- ignored
- recurring

Sources:

- frontend_console
- api
- railway_logs
- github_actions
- stripe_webhook
- resend_email
- database
- pdf_worker
- manual

### IncidentRecord

Required fields:

- id
- title
- status
- severity
- environment
- affectedAreas
- customerImpact
- startedAt
- resolvedAt
- rootCause
- workaround
- resolutionSummary
- relatedTicketIds
- relatedErrorIds
- relatedReleaseId
- relatedResolutionId
- timeline
- tags
- createdAt
- updatedAt

Statuses:

- investigating
- identified
- monitoring
- resolved
- postmortem_needed

### SupportUserRecord

Required fields:

- id
- displayName
- email
- role
- emailVerified
- relatedBusinessIds
- plan
- subscriptionStatus
- region
- language
- createdAt
- notes
- linkedTicketIds
- linkedErrorIds
- tags
- updatedAt

### BusinessSupportRecord

Required fields:

- id
- businessName
- ownerUserId
- ownerEmail
- plan
- subscriptionStatus
- includedBusinesses
- additionalBusinessSlots
- businessLimit
- region
- language
- createdAt
- linkedUserIds
- linkedTicketIds
- linkedErrorIds
- linkedIncidentIds
- notes
- tags
- updatedAt

### KnowledgeArticleRecord

Required fields:

- id
- title
- articleType
- category
- appArea
- summary
- symptoms
- cause
- troubleshootingSteps
- resolutionSteps
- escalationRules
- customerResponseTemplate
- internalNotes
- relatedTicketIds
- relatedResolutionIds
- tags
- createdAt
- updatedAt

Article types:

- how_to
- troubleshooting
- known_issue
- internal_procedure
- escalation_guide
- customer_response_template

### ResolutionRecord

Required fields:

- id
- title
- problemSummary
- rootCause
- fixApplied
- filesOrAreasTouched
- commandsUsed
- verificationSteps
- rollbackNotes
- relatedTicketIds
- relatedErrorIds
- relatedIncidentId
- relatedReleaseId
- relatedKnowledgeArticleIds
- createdAt
- updatedAt
- tags

### ReleaseRecord

Required fields:

- id
- title
- version
- commitSha
- environment
- releaseDate
- summary
- changedAreas
- migrationsIncluded
- knownRisks
- verificationChecklist
- rollbackNotes
- relatedTicketIds
- relatedErrorIds
- relatedIncidentIds
- relatedResolutionIds
- createdAt
- updatedAt
- tags

### ActivityRecord

Required fields:

- id
- entityType
- entityId
- action
- actor
- summary
- timestamp
- metadata

Entity types:

- ticket
- error
- incident
- user
- business
- knowledge_article
- resolution
- release
- data
- backup
- settings

### BackupRecord

Required fields:

- id
- createdAt
- label
- schemaVersion
- itemCounts
- snapshot

## 7. Local Storage Keys

Use namespaced localStorage keys.

Required keys:

- inex-it-support:schema-version
- inex-it-support:tickets
- inex-it-support:errors
- inex-it-support:incidents
- inex-it-support:users
- inex-it-support:businesses
- inex-it-support:knowledge-articles
- inex-it-support:resolutions
- inex-it-support:releases
- inex-it-support:activity
- inex-it-support:backups
- inex-it-support:settings

Every store should have:

- getAll
- getById
- create
- update
- archive or delete where appropriate
- seedDemoData
- clearData
- exportData
- importData

## 8. Phase-by-Phase Build Plan

## Phase 0 — Documentation and Direction Lock

Goal:

Create the source-of-truth build plan and prevent future drift.

Files to create or update:

- BUILD-PLAN.md
- README.md

Tasks:

1. Add this build plan as BUILD-PLAN.md.
2. Update README.md so it says the app is the internal support console for InEx Ledger 2.0.
3. State clearly that the app is local-first for the MVP.
4. State clearly that the app is not a generic office IT helpdesk.
5. List the final sections.
6. List the start command and build command.

Acceptance criteria:

- BUILD-PLAN.md exists.
- README.md matches the product direction.
- Anyone opening the repo understands exactly what is being built.

Completion point:

Phase 0 is complete when documentation clearly locks the product identity and scope.

## Phase 1 — Scaffold Route Map

Goal:

Create every major route and page shell before wiring logic.

Routes to add or confirm:

- /dashboard
- /tickets
- /tickets/new
- /tickets/:ticketId
- /errors
- /errors/new
- /errors/:errorId
- /incidents
- /incidents/new
- /incidents/:incidentId
- /users
- /users/:userId
- /businesses
- /businesses/:businessId
- /knowledge
- /knowledge/new
- /knowledge/:articleId
- /resolutions
- /resolutions/new
- /resolutions/:resolutionId
- /releases
- /releases/new
- /releases/:releaseId
- /reports
- /activity
- /data
- /backups
- /settings
- /settings/team
- /settings/categories
- /settings/workflow
- /login
- fallback not found route

Tasks:

1. Add missing page folders under src/pages.
2. Add missing page components.
3. Add missing routes to src/app/router.tsx.
4. Keep existing ticket routes intact.
5. Replace Assets route with Businesses for the MVP.
6. If Assets is kept temporarily, do not present it as hardware inventory.
7. Add placeholder detail pages for each major entity.
8. Add placeholder create pages for each major entity where needed.

Each scaffold page must include:

- Page title
- Short purpose statement
- Three to six placeholder cards
- Empty state area
- Future primary action button where appropriate

Acceptance criteria:

- Every final nav item has a working route.
- Every create/detail route has a page shell.
- No route shows generic office IT language.
- Existing ticket routes still work.
- npm run build passes.

Completion point:

Phase 1 is complete when the entire application route structure exists and can be navigated without broken pages.

## Phase 2 — Sidebar, Topbar, and Shared Shell Components

Goal:

Make the app feel like a real internal console while still using placeholder content.

Files to update or create:

- src/components/layout/AppShell.tsx
- src/components/layout/Sidebar.tsx
- src/components/layout/Topbar.tsx
- src/components/shared/PageHeader.tsx
- src/components/shared/SectionCard.tsx
- src/components/shared/StatCard.tsx
- src/components/shared/EmptyState.tsx
- src/components/shared/DataTableShell.tsx
- src/components/shared/StatusBadge.tsx
- src/components/shared/PriorityBadge.tsx
- src/components/shared/TimelineShell.tsx

Tasks:

1. Update sidebar brand text to InEx IT Support.
2. Update sidebar subtitle to Internal support console for InEx Ledger.
3. Add final navigation list.
4. Optionally group sidebar sections into Support, Product Context, and Operations.
5. Update topbar title to InEx Ledger Support Console.
6. Add a local-first MVP badge.
7. Add shared page header component.
8. Add shared card/empty/table/timeline scaffolds.
9. Replace one-off placeholder layout with reusable components where practical.

Acceptance criteria:

- The app shell reflects the real product direction.
- The nav includes all major sections.
- Shared scaffold components exist.
- Pages look consistent.
- npm run build passes.

Completion point:

Phase 2 is complete when the shell is visually and structurally ready for all modules.

## Phase 3 — Type Models and Constants

Goal:

Create stable TypeScript models before adding stores and forms.

Files to create or update:

- src/types/tickets.ts
- src/types/errors.ts
- src/types/incidents.ts
- src/types/users.ts
- src/types/businesses.ts
- src/types/knowledge.ts
- src/types/resolutions.ts
- src/types/releases.ts
- src/types/activity.ts
- src/types/backups.ts
- src/types/settings.ts
- src/constants/workflow.ts

Tasks:

1. Update TicketRecord to the final support-focused shape.
2. Add ErrorLogRecord.
3. Add IncidentRecord.
4. Add SupportUserRecord.
5. Add BusinessSupportRecord.
6. Add KnowledgeArticleRecord.
7. Add ResolutionRecord.
8. Add ReleaseRecord.
9. Add ActivityRecord.
10. Add BackupRecord.
11. Add SettingsRecord.
12. Move repeated dropdown options into shared constants.
13. Remove invalid generic category values.
14. Make sure all mock data conforms to the types.

Acceptance criteria:

- All major entity types exist.
- Ticket options are InEx Ledger-specific.
- There are no invalid mock categories.
- TypeScript strict build passes.

Completion point:

Phase 3 is complete when models are stable and compile cleanly.

## Phase 4 — InEx Ledger-Specific Mock Data

Goal:

Replace generic placeholder data with realistic support data for InEx Ledger.

Files to create or update:

- src/features/tickets/data/mockTickets.ts
- src/features/errors/data/mockErrors.ts
- src/features/incidents/data/mockIncidents.ts
- src/features/users/data/mockUsers.ts
- src/features/businesses/data/mockBusinesses.ts
- src/features/knowledge/data/mockKnowledgeArticles.ts
- src/features/resolutions/data/mockResolutions.ts
- src/features/releases/data/mockReleases.ts
- src/features/activity/data/mockActivity.ts

Mock ticket examples:

- Email verification link not received
- Business context missing on receipts page
- Transaction save returns 500
- Stripe checkout blocked because user is already subscribed
- Additional business slots not updating after subscription change
- Export history route returns 404
- PDF worker unavailable during export generation
- Categories not loading after migration

Mock error examples:

- Missing PDF_WORKER_SECRET
- Failed to load export public key
- Stripe webhook signature rejected
- Database column email_verified does not exist
- Migration failed near BOM character
- Cannot POST /html/register.html
- Business not found
- Receipts query references missing column

Mock incident examples:

- Receipt uploads failing in production
- Export generation unavailable because PDF worker env is missing
- Billing checkout conflict for existing Pro users
- Railway health check restart loop

Mock resolution examples:

- Fixed duplicate transactions route mount
- Fixed receipt business context lookup
- Fixed SQL BOM migration failure
- Fixed register form posting to static HTML
- Fixed export history route missing mount

Mock release examples:

- Billing add-on management scaffold
- Receipt storage migration release
- Email verification release
- Export grant security release
- UI modernization release

Tasks:

1. Replace generic helpdesk mock records.
2. Add mock data for every major section.
3. Make mock data internally linked where useful.
4. Ensure mock tickets link to mock users/businesses/errors/incidents.
5. Ensure mock resolutions link to mock tickets/errors/incidents.
6. Ensure mock releases link to relevant tickets/errors/incidents.

Acceptance criteria:

- Demo data tells a coherent InEx Ledger support story.
- No generic laptop/printer/Outlook examples remain.
- All mock data compiles.
- Scaffold pages can display demo counts later.

Completion point:

Phase 4 is complete when the app has realistic InEx Ledger demo data for every module.

## Phase 5 — Local Store Foundation

Goal:

Create local-first data stores for every module.

Files to create:

- src/lib/localStorageStore.ts
- src/features/tickets/lib/ticketStore.ts
- src/features/errors/lib/errorStore.ts
- src/features/incidents/lib/incidentStore.ts
- src/features/users/lib/userStore.ts
- src/features/businesses/lib/businessStore.ts
- src/features/knowledge/lib/knowledgeStore.ts
- src/features/resolutions/lib/resolutionStore.ts
- src/features/releases/lib/releaseStore.ts
- src/features/activity/lib/activityStore.ts
- src/features/backups/lib/backupStore.ts
- src/features/settings/lib/settingsStore.ts

Store requirements:

Each store should support:

- getAll
- getById
- create
- update
- archive/delete where appropriate
- seedDemoData
- clearData

The shared localStorage helper should support:

- Safe JSON parsing
- Fallback to default data
- Schema version handling
- Basic validation hook
- Namespaced keys

Tasks:

1. Create a shared local storage utility.
2. Update ticket store to use the shared helper.
3. Create stores for errors, incidents, users, businesses, knowledge, resolutions, releases, activity, backups, and settings.
4. Add schema version key.
5. Add reset-to-demo behavior.

Acceptance criteria:

- Every module has a local store.
- Data survives refresh.
- Bad JSON does not crash the app.
- Stores can seed demo data.
- npm run build passes.

Completion point:

Phase 5 is complete when every scaffold section has a data store ready to wire.

## Phase 6 — Tickets Module Completion

Goal:

Finish the help desk workflow first because tickets are the center of the app.

Tasks:

1. Keep existing ticket queue.
2. Add search.
3. Add filters for status, priority, severity, category, source, environment, app area, and assigned tech.
4. Add queue tabs:
   - All
   - My Queue
   - Unassigned
   - Waiting on User
   - Escalated
   - Resolved
   - Archived
5. Add sorting by updated date, due date, priority, and status.
6. Add full ticket edit form.
7. Add internal note form.
8. Add resolution note form.
9. Add reopen resolved ticket action.
10. Add archive action with confirmation.
11. Link tickets to users/businesses/errors/incidents/releases/resolutions/KB articles.
12. Write ticket actions into global activity.

Acceptance criteria:

- A ticket can be created, searched, filtered, edited, assigned, commented on, resolved, reopened, and archived.
- Ticket detail shows linked records.
- Ticket timeline captures important actions.
- Global activity receives ticket events.
- npm run build passes.

Completion point:

Phase 6 is complete when the help desk workflow is usable end-to-end locally.

## Phase 7 — Errors Module

Goal:

Build the error log desk.

Pages:

- /errors
- /errors/new
- /errors/:errorId

Tasks:

1. Create error list page.
2. Add error create form.
3. Add error detail page.
4. Add fields for message, raw log, stack trace, source, environment, app area, severity, and status.
5. Add occurrence count.
6. Add first seen and last seen fields.
7. Add status changes.
8. Add link-to-ticket action.
9. Add link-to-incident action.
10. Add link-to-resolution action.
11. Add ignore/fixed/recurring statuses.
12. Add filters by source, environment, app area, severity, and status.
13. Write error actions into global activity.

Acceptance criteria:

- Errors can be logged manually.
- Errors can be linked to tickets/incidents/resolutions.
- Errors can be marked fixed, ignored, or recurring.
- Error list can be searched and filtered.
- npm run build passes.

Completion point:

Phase 7 is complete when technical errors can be tracked independently from help desk tickets.

## Phase 8 — Incidents Module

Goal:

Build the incident desk for larger support events.

Pages:

- /incidents
- /incidents/new
- /incidents/:incidentId

Tasks:

1. Create incident list page.
2. Add incident create form.
3. Add incident detail page.
4. Add incident status workflow.
5. Add affected areas.
6. Add customer impact summary.
7. Add root cause field.
8. Add workaround field.
9. Add resolution summary field.
10. Add incident timeline.
11. Link tickets to incidents.
12. Link errors to incidents.
13. Link releases to incidents.
14. Link resolutions to incidents.
15. Write incident actions into global activity.

Acceptance criteria:

- Incidents can group multiple tickets and errors.
- Incident status can move from investigating to resolved.
- Incident detail explains customer impact and root cause.
- npm run build passes.

Completion point:

Phase 8 is complete when larger production/support problems can be tracked separately from tickets.

## Phase 9 — Users and Businesses Modules

Goal:

Add support-side customer context.

Pages:

- /users
- /users/:userId
- /businesses
- /businesses/:businessId

Tasks:

1. Build users list page.
2. Build user detail page.
3. Build businesses list page.
4. Build business detail page.
5. Show linked tickets on user detail.
6. Show linked errors on user detail.
7. Show linked businesses on user detail.
8. Show linked users on business detail.
9. Show linked tickets/errors/incidents on business detail.
10. Add internal support notes.
11. Add subscription context fields.
12. Add business limit/additional slot context fields.
13. Write note/add/update actions into global activity.

Acceptance criteria:

- Support can view a user and see their tickets.
- Support can view a business and see related issues.
- Business support records include plan/subscription context.
- npm run build passes.

Completion point:

Phase 9 is complete when tickets can be understood through user and business context.

## Phase 10 — Knowledge Base and Resolutions

Goal:

Build reusable support knowledge and historical fix records.

Pages:

- /knowledge
- /knowledge/new
- /knowledge/:articleId
- /resolutions
- /resolutions/new
- /resolutions/:resolutionId

Tasks for Knowledge Base:

1. Build article list.
2. Add article create/edit form.
3. Add article detail page.
4. Add article type field.
5. Add symptoms/cause/troubleshooting/resolution/escalation sections.
6. Add customer response template field.
7. Link articles to tickets and resolutions.

Tasks for Resolutions:

1. Build resolution list.
2. Add resolution create/edit form.
3. Add resolution detail page.
4. Add root cause.
5. Add fix applied.
6. Add files/areas touched.
7. Add commands used.
8. Add verification steps.
9. Add rollback notes.
10. Link resolutions to tickets/errors/incidents/releases/KB articles.
11. Add convert-resolution-to-KB idea as a future action, not first version.

Acceptance criteria:

- Reusable guides live in Knowledge Base.
- Actual solved cases live in Resolutions.
- Tickets/errors/incidents can link to both.
- npm run build passes.

Completion point:

Phase 10 is complete when the app can preserve both repeatable support procedures and exact historical fixes.

## Phase 11 — Releases Module

Goal:

Track product changes and deploy context.

Pages:

- /releases
- /releases/new
- /releases/:releaseId

Tasks:

1. Build release list.
2. Add release create/edit form.
3. Add release detail page.
4. Add version/commit/environment/date fields.
5. Add changed areas.
6. Add migrations included flag.
7. Add known risks.
8. Add verification checklist.
9. Add rollback notes.
10. Link releases to tickets/errors/incidents/resolutions.
11. Write release actions into global activity.

Acceptance criteria:

- Support can see what changed recently.
- Tickets/errors/incidents can be tied to releases.
- Release records include verification and rollback notes.
- npm run build passes.

Completion point:

Phase 11 is complete when deploy/release context is available for troubleshooting.

## Phase 12 — Dashboard Wiring

Goal:

Turn the dashboard into the real command center.

Tasks:

1. Pull counts from local stores.
2. Show open tickets.
3. Show critical tickets.
4. Show waiting on user.
5. Show escalated tickets.
6. Show active incidents.
7. Show new/recurring errors.
8. Show recent activity.
9. Show my queue.
10. Show recently updated tickets.
11. Link dashboard cards to filtered pages where practical.

Acceptance criteria:

- Dashboard reflects actual local data.
- Dashboard helps decide what to work on next.
- No placeholder-only dashboard remains.
- npm run build passes.

Completion point:

Phase 12 is complete when the dashboard is useful for daily support operations.

## Phase 13 — Reports and Activity

Goal:

Add operational visibility.

Reports tasks:

1. Tickets by status.
2. Tickets by category.
3. Tickets by app area.
4. Tickets by priority/severity.
5. Tickets by environment.
6. Errors by source.
7. Errors by app area.
8. Incidents by status/severity.
9. Most affected businesses.
10. Repeated issue patterns.

Activity tasks:

1. Build global activity list.
2. Add filters by entity type.
3. Add filters by action.
4. Add date sorting.
5. Link activity rows to related records.

Acceptance criteria:

- Reports show useful support summaries.
- Activity shows real actions across the app.
- npm run build passes.

Completion point:

Phase 13 is complete when support trends and audit history are visible.

## Phase 14 — Data, Backups, Import, and Export

Goal:

Protect local-first support data.

Data page tasks:

1. Export all app data to JSON.
2. Import app data from JSON.
3. Validate import shape.
4. Reject invalid imports safely.
5. Reset demo data.
6. Clear local data with confirmation.
7. Show schema version.
8. Show item counts by module.

Backups page tasks:

1. Create backup snapshot.
2. List backup snapshots.
3. Restore from backup.
4. Delete backup.
5. Export backup.
6. Show backup item counts.

Acceptance criteria:

- All local data can be exported.
- Exported data can be imported.
- Backups can be created and restored.
- Destructive actions require confirmation.
- npm run build passes.

Completion point:

Phase 14 is complete when local support data is portable and recoverable.

## Phase 15 — Settings and Workflow Configuration

Goal:

Make the app configurable without code edits.

Settings pages:

- /settings
- /settings/team
- /settings/categories
- /settings/workflow

Tasks:

1. Add technician management.
2. Add default assignee.
3. Add category management.
4. Add app area management.
5. Add environment management.
6. Add source management.
7. Add status/priorities display.
8. Add local preference settings.
9. Move form dropdowns toward settings-driven options.
10. Write settings changes into global activity.

Acceptance criteria:

- Technicians can be managed locally.
- Default options are configurable.
- Forms can use settings values where appropriate.
- npm run build passes.

Completion point:

Phase 15 is complete when support workflow vocabulary can be managed from Settings.

## Phase 16 — Final Local-First MVP Completion

Goal:

Make the local-first support console complete.

Final review checklist:

- All final nav sections exist.
- No generic IT helpdesk language remains.
- Dashboard is wired.
- Tickets are fully usable.
- Errors are fully usable.
- Incidents are fully usable.
- Users and businesses provide support context.
- Knowledge Base stores reusable procedures.
- Resolutions store historical fixes.
- Releases store deploy/change context.
- Reports provide useful summaries.
- Activity shows audit history.
- Data export/import works.
- Backups work.
- Settings work.
- Demo data is InEx Ledger-specific.
- All links and routes work.
- Empty states are helpful.
- Destructive actions require confirmation.
- npm run build passes.

Completion point:

At the end of Phase 16, the app is 100% complete as a local-first MVP for InEx Ledger support operations.

This means it is complete as:

- Help desk
- Error log desk
- Incident desk
- Resolution desk
- Knowledge desk
- Support reporting desk
- Local backup/export desk

It is not yet complete as a connected production admin panel. That is intentionally deferred.

## Phase 17 — Future Production Integration Planning

Goal:

Plan live integration only after the local-first MVP is complete.

Possible future integrations with InEx Ledger 2.0:

- Read-only user lookup
- Read-only business lookup
- Read-only subscription lookup
- Contact form ticket intake
- Error ingestion endpoint
- App event/audit log ingestion
- Receipt/export failure ingestion
- Release/deploy metadata import
- Support-only admin auth

Strict rules:

1. Start read-only.
2. Do not expose financial ledger details casually.
3. Do not mutate production user/business/transaction data from this app at first.
4. Keep support notes separate from customer financial records.
5. Add authentication before connecting to production data.
6. Add audit logs before any production write capability.

Acceptance criteria:

Phase 17 is only planning until Phase 16 is complete.

## 9. Definition of 100% Complete for the MVP

The app is MVP-complete when it can do all of the following locally:

1. Create and manage support tickets.
2. Create and manage technical error logs.
3. Create and manage incidents.
4. Track support users.
5. Track business/account support context.
6. Write reusable Knowledge Base articles.
7. Record exact historical resolutions.
8. Track releases/deployments.
9. Link records together across modules.
10. Show global support activity.
11. Show dashboard counts and urgent work.
12. Show basic support reports.
13. Export all data.
14. Import all data.
15. Create and restore backups.
16. Manage workflow settings.
17. Build cleanly with npm run build.
18. Avoid all generic IT helpdesk drift.

## 10. Immediate Next Commit After This File

After this file is added, the next coding commit should be:

**Align scaffold navigation with final support console sections**

Files likely touched:

- README.md
- src/app/router.tsx
- src/components/layout/Sidebar.tsx
- src/components/layout/Topbar.tsx
- src/pages/errors/*
- src/pages/incidents/*
- src/pages/businesses/*
- src/pages/resolutions/*
- src/pages/releases/*
- src/components/shared/*

Do not wire stores in that commit.

The next commit should only create the complete scaffold.

## 11. Codex Guardrails

When asking Codex to work on this repo, use these guardrails:

- Build scaffold first.
- Do not add backend/auth/database.
- Do not integrate production InEx Ledger APIs yet.
- Do not convert this into a generic office IT helpdesk.
- Keep examples specific to InEx Ledger.
- Preserve existing working ticket routes unless intentionally changing them.
- Run npm run build after changes.
- Avoid unnecessary new dependencies.
- Use TypeScript types before wiring stores.
- Keep styling consistent with the existing dark admin console.
- Do not delete working ticket functionality while adding scaffold pages.

## 12. Current Repo Notes

Current repo foundation:

- React + Vite + TypeScript
- React Router
- AppShell with Sidebar and Topbar
- Placeholder pages for many sections
- Partially working Tickets module
- localStorage ticket persistence
- Strict TypeScript config

Known cleanup needed:

- README is too light.
- App identity still sounds generic.
- Current mock tickets are generic office IT records.
- Current mock tickets do not match the richer TicketRecord shape.
- Assets should become Businesses for the MVP.
- Errors, Incidents, Resolutions, Releases, and Businesses are missing as first-class sections.
- Build should be verified after mock/type cleanup.
