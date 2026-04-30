create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  actor_account_id uuid references internal_support_accounts(id) on delete set null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_entity_idx on activity_log (entity_type, entity_id, created_at desc);
create index if not exists activity_log_actor_idx on activity_log (actor_account_id, created_at desc);
