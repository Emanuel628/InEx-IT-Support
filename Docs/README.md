# InEx IT Support

InEx IT Support is the internal support console for **InEx Ledger 2.0**.

It is a **local-first MVP** built with React, Vite, and TypeScript so support work can be scaffolded, tested, and refined before any live production integrations are added.

## What this app is

This app is for tracking and organizing:

- customer support tickets
- technical errors
- product incidents
- user support context
- business support context
- reusable troubleshooting knowledge
- historical resolutions
- release and deploy context
- support activity history
- local data exports and backups

## What this app is not

This is **not** a generic office IT helpdesk.

It is not primarily for:

- printers
- laptops
- Microsoft 365 access
- hardware inventory
- generic internal office support workflows

The support context is specific to InEx Ledger issues such as authentication failures, billing problems, receipt upload issues, export problems, deployment regressions, migration issues, and business-context errors.

## Final sections

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

## Build approach

This project is being built scaffold-first in this order:

1. full route map and page identities
2. shared app shell and navigation
3. TypeScript models
4. InEx Ledger-specific mock data
5. local-first stores
6. module-by-module workflow completion
7. data export, import, and backups
8. settings-driven workflow vocabulary
9. future production integration planning

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Documentation

Project documentation lives in the `Docs/` folder.

Key docs include:

- `Docs/BUILD-PLAN.md`
- `Docs/README.md`
- `Docs/PRODUCTION-INTEGRATION-PLAN.md`
- `Docs/USER-BUSINESS-LOOKUP-PLAN.md`
- `Docs/BILLING-SUBSCRIPTION-CONTEXT-PLAN.md`
- `Docs/ERROR-INGESTION-PLAN.md`
- `Docs/SUPPORT-INTAKE-INGESTION-PLAN.md`
- `Docs/RELEASE-DEPLOY-SYNC-PLAN.md`
- `Docs/SCOPED-SUPPORT-ACTIONS-PLAN.md`

## Source of truth

The canonical build direction for the app lives in `Docs/BUILD-PLAN.md`.
