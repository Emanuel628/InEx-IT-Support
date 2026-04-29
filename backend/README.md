# InEx IT Support Backend

This folder contains the first backend scaffold for InEx IT Support.

## Current scope

This initial backend phase includes:

- Express app scaffold
- environment validation
- health endpoint
- PostgreSQL connection scaffold
- migrations folder scaffold

## Commands

```bash
cd backend
npm install
npm run dev
npm run build
npm run start
```

## Environment

Copy `.env.example` to `.env` and fill in the values you need.

Minimum local values:

- `PORT`
- `CORS_ORIGIN`
- optional `DATABASE_URL`

If `DATABASE_URL` is not set yet, the backend still boots and the health response will show that the database is not configured.

## First backend milestone

The first goal is Phase A from `Docs/BACKEND-SECURITY-AUTH-API-PLAN.md`:

- API service scaffold
- health endpoint
- env validation
- DB connection layer
- migration runner scaffold
