-- Seed missing service records (Automation Systems, Smart Creative Software)
-- Safe to run multiple times: uses ON CONFLICT(id) DO UPDATE

insert into public.services (id, title, description, icon_key, gradient)
values
  ('fallback-automation', 'Automation Systems', 'Intelligent automation solutions that streamline workflows and boost productivity.', 'Cpu', 'from-accent to-accent-cyan'),
  ('fallback-creative', 'Smart Creative Software', 'Innovative software tools that empower creators with intelligent features.', 'Wand2', 'from-primary-glow to-accent-magenta')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  icon_key = excluded.icon_key,
  gradient = excluded.gradient;

-- Verify
select id, title, icon_key, gradient from public.services
where id in ('fallback-automation','fallback-creative')
order by id;