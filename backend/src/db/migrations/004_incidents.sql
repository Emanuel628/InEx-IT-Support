create table if not exists incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  customer_impact text not null,
  status text not null,
  severity text not null,
  environment text not null,
  affected_areas jsonb not null default '[]'::jsonb,
  started_at timestamptz not null,
  resolved_at timestamptz,
  summary text not null,
  created_by_account_id uuid not null references internal_support_accounts(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint incidents_status_check check (status in ('investigating', 'identified', 'monitoring', 'resolved', 'postmortem_needed')),
  constraint incidents_severity_check check (severity in ('minor', 'major', 'critical'))
);

create index if not exists incidents_created_at_idx on incidents (created_at desc);
create index if not exists incidents_status_idx on incidents (status);
create index if not exists incidents_severity_idx on incidents (severity);
create index if not exists incidents_created_by_account_id_idx on incidents (created_by_account_id);
