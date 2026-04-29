# Backend Auth Notes

This folder is reserved for the real auth implementation that follows the current scaffold.

## Current state

The backend currently includes:

- `POST /auth/login` route scaffold
- `GET /auth/me` route scaffold
- payload validation for company ID login
- initial SQL schema draft for internal support accounts

## Next auth steps

Planned next work:

1. password hashing utility
2. account creation/bootstrap script for first internal users
3. repository for internal support accounts
4. login flow against Postgres
5. current-user lookup from session or token auth
6. role-aware auth middleware

## Identity model

Use two IDs:

- database `id` as immutable UUID primary key
- `company_id` as stable human-facing login identifier

The UUID should anchor authored work and audit history.
The company ID should be what humans use to sign in and identify support accounts.
