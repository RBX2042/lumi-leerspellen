alter table lumi_subscriptions add column if not exists trial_used boolean not null default false;
update lumi_subscriptions set trial_used = true where plan in ('trial', 'gezin', 'plus', 'school') or trial_ends_at is not null;
