create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  requester_name text not null,
  requester_email text not null,
  business_name text,
  status text not null,
  priority text not null,
  category text not null,
  source text not null,
  environment text not null,
  app_area text not null,
  assigned_account_id uuid references internal_support_accounts(id) on delete set null,
  details text not null,
  created_by_account_id uuid not null references internal_support_accounts(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tickets_status_check check (status in ('new', 'in_progress', 'waiting_on_user', 'escalated', 'resolved', 'archived')),
  constraint tickets_priority_check check (priority in ('low', 'medium', 'high', 'critical'))
);

create index if not exists tickets_created_at_idx on tickets (created_at desc);
create index if not exists tickets_status_idx on tickets (status);
create index if not exists tickets_priority_idx on tickets (priority);
create index if not exists tickets_assigned_account_id_idx on tickets (assigned_account_id);
create index if not exists tickets_created_by_account_id_idx on tickets (created_by_account_id);
