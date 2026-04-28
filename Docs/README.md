# InEx IT Support

Local-first IT support dashboard built with React, Vite, and TypeScript.

## Planned sections

- Dashboard
- Tickets
- Users
- Assets
- Knowledge Base
- Reports
- Activity
- Data
- Settings

## Start

```bash
npm install
npm run dev
```

# InEx Ledger

Calm, modern bookkeeping for solo operators, freelancers, independent contractors, and small service businesses.

InEx Ledger is built to help users track income and expenses, manage receipts, review business activity, and prepare cleaner records for tax time without the clutter of traditional accounting software.

## Live App

[inexledger.com](https://inexledger.com)

## What InEx Ledger Is

InEx Ledger is a bookkeeping-first web application focused on:

- clean income and expense tracking
- receipt capture and recordkeeping
- export-ready reporting for tax prep
- simple business workflows without bloated accounting software
- support for US and Canada users
- multilingual support

## Core Stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Email:** Resend
- **Deployment:** Railway
- **Billing:** Stripe
- **PDF Exports:** dedicated PDF worker service

## Repository Structure

- `In-Ex-Ledger-API/` — main application backend and live frontend bundle under `public/`
- `pdf-worker/` — PDF export service
- `docker-entrypoint-initdb.d/` — database initialization and migration SQL
- `scripts/` — utility and support scripts
- `Docs/` — project documentation, build plan, and reference docs

## Current Product Scope

The codebase currently includes support for:

- authentication and secure sign-in
- income and expense tracking
- receipt uploads
- CSV and PDF exports
- Stripe-backed subscription management
- multi-factor authentication and session controls
- multilingual support
- US and Canada support

The broader repository also includes business-facing modules and workflows that extend beyond the original V1 bookkeeping core.

## Environment Setup

Use `In-Ex-Ledger-API/.env.example` as the baseline for local and production configuration.

### Important billing variables

Stripe now uses separate price IDs for region and billing interval, including additional-business pricing. Configure the values in `.env.example`, including:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_V1_MONTHLY_US`
- `STRIPE_PRICE_V1_YEARLY_US`
- `STRIPE_PRICE_V1_MONTHLY_CA`
- `STRIPE_PRICE_V1_YEARLY_CA`
- `STRIPE_PRICE_ADDITIONAL_BUSINESS_MONTHLY_US`
- `STRIPE_PRICE_ADDITIONAL_BUSINESS_YEARLY_US`
- `STRIPE_PRICE_ADDITIONAL_BUSINESS_MONTHLY_CA`
- `STRIPE_PRICE_ADDITIONAL_BUSINESS_YEARLY_CA`
- `STRIPE_WEBHOOK_SECRET`

## Documentation

All project documentation lives in the `Docs/` folder.

That includes:

- build plan
- task tracking
- deployment notes
- authentication notes
- security notes
- runbooks
- project README

## Deployment

The application is deployed on Railway, with the primary live app available at:

- `https://inexledger.com`

## License

PRIVATE — All rights reserved.

