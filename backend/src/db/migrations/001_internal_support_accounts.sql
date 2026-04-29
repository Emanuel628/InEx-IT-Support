create extension if not exists pgcrypto;

create sequence if not exists internal_support_company_id_seq start 1;

create table if not exists internal_support_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id text not null unique default ('IU-' || lpad(nextval('internal_support_company_id_seq')::text, 6, '0')),
  display_name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz,
  constraint internal_support_accounts_role_check check (role in ('admin', 'support_manager', 'support_agent', 'viewer'))
);

create index if not exists internal_support_accounts_role_idx on internal_support_accounts (role);
