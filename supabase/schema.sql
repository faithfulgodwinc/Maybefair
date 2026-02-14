-- Create a table for public profiles (extends auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Emails table
create table emails (
  id text not null, -- Gmail Message ID
  user_id uuid references auth.users not null,
  thread_id text,
  subject text,
  snippet text,
  sender text, -- renamed from 'from' to avoid reserved keyword issues
  body text,
  category text, -- 'meeting', 'urgent', 'newsletter', etc.
  confidence float,
  label_ids text[], -- Custom Gmail labels
  received_at timestamp with time zone,
  processed_at timestamp with time zone default now(),
  primary key (id, user_id)
);

alter table emails enable row level security;

create policy "Users can view own emails" on emails
  for select using (auth.uid() = user_id);

create policy "Users can insert own emails" on emails
  for insert with check (auth.uid() = user_id);

create policy "Users can update own emails" on emails
  for update using (auth.uid() = user_id);
  
create policy "Users can delete own emails" on emails
  for delete using (auth.uid() = user_id);

-- Drafts table
create table drafts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  email_id text, -- link to original email ID, not FK to allow flexibility if email not yet saved
  content text,
  status text default 'pending', -- 'pending', 'approved', 'sent'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table drafts enable row level security;

create policy "Users can view own drafts" on drafts
  for select using (auth.uid() = user_id);

create policy "Users can insert own drafts" on drafts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own drafts" on drafts
  for update using (auth.uid() = user_id);

create policy "Users can delete own drafts" on drafts
  for delete using (auth.uid() = user_id);
