alter table lumi_subscriptions add column if not exists referral_code text;
alter table lumi_subscriptions add column if not exists referred_by text;
alter table lumi_subscriptions add column if not exists billing text not null default 'month';
create unique index if not exists lumi_subscriptions_referral_code_uidx
  on lumi_subscriptions (referral_code) where referral_code is not null;

create table if not exists lumi_leads (
  id serial primary key,
  user_id text not null,
  kind text not null default 'school',
  school text not null,
  groep text,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists lumi_leads_user_idx on lumi_leads (user_id);
