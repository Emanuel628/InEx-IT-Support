create table if not exists errors (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  status text not null,
  severity text not null,
  source text not null,
  app_area text not null,
  environment text not null,
  occurrence_count integer not null default 1,
  first_seen_at timestamptz not null,
  last_seen_at timestamptz not null,
  notes text not null,
  created_by_account_id uuid not null references internal_support_accounts(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint errors_status_check check (status in ('new', 'triaged', 'linked_to_ticket', 'investigating', 'fixed', 'ignored', 'recurring')),
  constraint errors_severity_check check (severity in ('minor', 'major', 'critical')),
  constraint errors_occurrence_count_check check (occurrence_count >= 1)
);

create index if not exists errors_created_at_idx on errors (created_at desc);
create index if not exists errors_status_idx on errors (status);
create index if not exists errors_severity_idx on errors (severity);
create index if not exists errors_created_by_account_id_idx on errors (created_by_account_id);
