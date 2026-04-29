# Backend Migrations

This folder is reserved for versioned PostgreSQL migrations.

The first backend implementation phase only establishes the folder structure.

Planned first migration work:

- 001 initial schema
- 002 auth and role structures if separated
- 003 activity log hardening
- 004 integration support fields later

Rules:

- do not make manual production-only schema edits
- keep migration history versioned
- use the same migration chain across dev, staging, and production
