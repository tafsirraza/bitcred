-- Create the wallet_records table
create table wallet_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  wallet text not null,
  score integer not null,
  zk_proof text not null,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS on wallet_records
alter table wallet_records enable row level security;

-- Create policy for users to see only their own records
create policy "Users can view their own records"
  on wallet_records for select
  using (auth.uid() = user_id);

-- Create policy for users to insert their own records
create policy "Users can insert their own records"
  on wallet_records for insert
  with check (auth.uid() = user_id);

-- Create the user_settings table
create table user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  email_notifications boolean default true not null,
  public_profile boolean default false not null,
  api_access boolean default false not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS on user_settings
alter table user_settings enable row level security;

-- Create policy for users to see only their own settings
create policy "Users can view their own settings"
  on user_settings for select
  using (auth.uid() = user_id);

-- Create policy for users to update their own settings
create policy "Users can update their own settings"
  on user_settings for update
  using (auth.uid() = user_id);

-- Create policy for users to insert their own settings
create policy "Users can insert their own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);
