create table if not exists lumi_children (
  id serial primary key,
  user_id text not null,
  name text not null,
  age int not null,
  group_key text not null,
  avatar text not null default 'uil',
  daily_minutes int not null default 20,
  created_at timestamptz not null default now()
);
create index if not exists lumi_children_user_idx on lumi_children (user_id);

create table if not exists lumi_subscriptions (
  user_id text primary key,
  plan text not null default 'free',
  status text not null default 'active',
  trial_ends_at timestamptz,
  period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists lumi_skill (
  id serial primary key,
  user_id text not null,
  child_id int not null,
  game_id text not null,
  level int not null default 1,
  mastery int not null default 0,
  correct int not null default 0,
  attempts int not null default 0,
  streak int not null default 0,
  best_streak int not null default 0,
  updated_at timestamptz not null default now(),
  unique (child_id, game_id)
);
create index if not exists lumi_skill_user_idx on lumi_skill (user_id);

create table if not exists lumi_sessions (
  id serial primary key,
  user_id text not null,
  child_id int not null,
  game_id text not null,
  score int not null default 0,
  correct int not null default 0,
  attempts int not null default 0,
  xp int not null default 0,
  duration_sec int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists lumi_sessions_user_idx on lumi_sessions (user_id);
create index if not exists lumi_sessions_child_idx on lumi_sessions (child_id, created_at desc);

create table if not exists lumi_daily (
  user_id text not null,
  child_id int not null,
  day date not null,
  plays int not null default 0,
  minutes int not null default 0,
  primary key (child_id, day)
);
