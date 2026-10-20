create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text not null unique,
    display_name text not null,
    role text not null default 'buyer' check (role in ('buyer', 'admin')),
    is_suspended boolean not null default false,
    created_at timestamptz not null default now(),
    constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_]{3,32}$'),
    constraint profiles_display_name_length check (length(trim(display_name)) between 2 and 80)
);

create unique index profiles_username_lower_unique on public.profiles (lower(username));

create table public.categories (
    slug text primary key,
    name text not null,
    icon text not null default '',
    description text not null default '',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.campus_locations (
    name text primary key,
    group_name text not null check (group_name in ('Hostels', 'Shops & Food Locations')),
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.listings (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references public.profiles (id) on delete set null,
    category_slug text not null references public.categories (slug) on update cascade on delete restrict,
    location_name text not null references public.campus_locations (name) on update cascade on delete restrict,
    name text not null check (length(trim(name)) between 2 and 120),
    description text not null check (length(trim(description)) between 3 and 2000),
    price numeric(12, 2) not null check (price > 0),
    image_url text not null default '' check (image_url = '' or image_url ~ '^https://'),
    seller_name text not null,
    whatsapp_number text not null default '',
    is_demo boolean not null default false,
    status text not null default 'available' check (status in ('available', 'sold', 'unavailable')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.listing_reports (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references public.listings (id) on delete cascade,
    reporter_id uuid not null references public.profiles (id) on delete cascade,
    reason text not null check (length(trim(reason)) between 5 and 1000),
    status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
    moderator_id uuid references public.profiles (id) on delete set null,
    moderator_note text not null default '',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index listings_category_status_idx on public.listings (category_slug, status);
create index listings_location_status_idx on public.listings (location_name, status);
create index listings_owner_idx on public.listings (owner_id);
create index listing_reports_status_idx on public.listing_reports (status, created_at desc);

create or replace function public.is_marketplace_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'admin'
          and not p.is_suspended
    );
$$;

create or replace function public.is_active_marketplace_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and not p.is_suspended
    );
$$;

revoke all on function public.is_marketplace_admin() from public, anon;
revoke all on function public.is_active_marketplace_user() from public, anon;
grant execute on function public.is_marketplace_admin() to authenticated;
grant execute on function public.is_marketplace_admin() to anon;
grant execute on function public.is_active_marketplace_user() to authenticated;

create or replace function public.create_marketplace_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    requested_username text;
    requested_name text;
begin
    requested_username := new.raw_user_meta_data ->> 'username';
    requested_name := new.raw_user_meta_data ->> 'display_name';

    if requested_username is null
       or requested_username !~ '^[a-zA-Z0-9_]{3,32}$'
       or lower(requested_username) = 'karakata_admin' then
        requested_username := 'member_' || replace(new.id::text, '-', '');
    end if;

    if requested_name is null or length(trim(requested_name)) = 0 then
        requested_name := requested_username;
    end if;

    insert into public.profiles (id, username, display_name, role)
    values (new.id, requested_username, trim(requested_name), 'buyer');
    return new;
end;
$$;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.create_marketplace_profile();

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is null then
        return new;
    end if;

    if auth.uid() = old.id then
        if lower(new.username) = 'karakata_admin' then
            raise exception 'This reserved administrator username cannot be claimed by public accounts.';
        end if;
        if new.role is distinct from old.role
           or new.is_suspended is distinct from old.is_suspended then
            raise exception 'Users cannot change their role or suspension status.';
        end if;
        return new;
    end if;

    if not public.is_marketplace_admin() then
        raise exception 'Only an administrator can manage other profiles.';
    end if;

    return new;
end;
$$;

create trigger protect_profile_privileges_before_update
before update on public.profiles
for each row execute function public.protect_profile_privileges();

create or replace function public.protect_listing_owner_and_demo_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if public.is_marketplace_admin() then
        return new;
    end if;

    if auth.uid() is null then
        if current_setting('request.jwt.claim.role', true) = 'service_role' then
            return new;
        end if;
        raise exception 'An active signed-in account is required to manage listings.';
    end if;

    if not public.is_active_marketplace_user() then
        raise exception 'An active signed-in account is required to manage listings.';
    end if;

    if tg_op = 'INSERT' then
        new.owner_id := auth.uid();
        new.is_demo := false;
        select p.display_name into new.seller_name
        from public.profiles p
        where p.id = auth.uid();
    else
        if old.is_demo or old.owner_id is distinct from auth.uid()
           or new.owner_id is distinct from old.owner_id
           or new.is_demo is distinct from old.is_demo then
            raise exception 'You can only edit your own non-demo listings.';
        end if;
        select p.display_name into new.seller_name
        from public.profiles p
        where p.id = auth.uid();
    end if;

    new.updated_at := now();
    return new;
end;
$$;

create trigger protect_listing_owner_and_demo
before insert or update on public.listings
for each row execute function public.protect_listing_owner_and_demo_fields();

create or replace function public.protect_report_moderation_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if public.is_marketplace_admin() then
        return new;
    end if;

    if tg_op = 'INSERT' then
        if auth.uid() is null or new.reporter_id is distinct from auth.uid() then
            raise exception 'Reports must be submitted by the signed-in reporter.';
        end if;
        new.status := 'open';
        new.moderator_id := null;
        new.moderator_note := '';
        return new;
    end if;

    raise exception 'Only administrators can change report moderation fields.';
end;
$$;

create trigger protect_report_moderation_fields_before_write
before insert or update on public.listing_reports
for each row execute function public.protect_report_moderation_fields();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create trigger reports_set_updated_at
before update on public.listing_reports
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.campus_locations enable row level security;
alter table public.listings enable row level security;
alter table public.listing_reports enable row level security;

grant select, update on public.profiles to authenticated;
grant select on public.categories, public.campus_locations to anon, authenticated;
grant insert, update, delete on public.categories, public.campus_locations to authenticated;
grant select, insert, update, delete on public.listings to authenticated;
grant select on public.listings to anon;
grant select, insert, update on public.listing_reports to authenticated;

create policy "Profiles visible to account owner and admins"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_marketplace_admin());

create policy "Accounts update own safe fields or admins manage profiles"
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_marketplace_admin())
with check (id = auth.uid() or public.is_marketplace_admin());

create policy "Categories visible when active or to admins"
on public.categories for select to anon, authenticated
using (is_active or public.is_marketplace_admin());

create policy "Admins manage categories"
on public.categories for all to authenticated
using (public.is_marketplace_admin())
with check (public.is_marketplace_admin());

create policy "Locations visible when active or to admins"
on public.campus_locations for select to anon, authenticated
using (is_active or public.is_marketplace_admin());

create policy "Admins manage locations"
on public.campus_locations for all to authenticated
using (public.is_marketplace_admin())
with check (public.is_marketplace_admin());

create policy "Listings visible to public when available"
on public.listings for select to anon, authenticated
using (
    status = 'available'
    or owner_id = auth.uid()
    or public.is_marketplace_admin()
);

create policy "Active users create their own listings"
on public.listings for insert to authenticated
with check (
    owner_id = auth.uid()
    and not is_demo
    and public.is_active_marketplace_user()
);

create policy "Admins create listings"
on public.listings for insert to authenticated
with check (public.is_marketplace_admin());

create policy "Owners or admins update listings"
on public.listings for update to authenticated
using (
    (owner_id = auth.uid() and not is_demo and public.is_active_marketplace_user())
    or public.is_marketplace_admin()
)
with check (
    (owner_id = auth.uid() and not is_demo and public.is_active_marketplace_user())
    or public.is_marketplace_admin()
);

create policy "Owners or admins delete listings"
on public.listings for delete to authenticated
using (
    (owner_id = auth.uid() and not is_demo and public.is_active_marketplace_user())
    or public.is_marketplace_admin()
);

create policy "Active users report listings"
on public.listing_reports for insert to authenticated
with check (
    reporter_id = auth.uid()
    and status = 'open'
    and public.is_active_marketplace_user()
);

create policy "Reporters and admins view reports"
on public.listing_reports for select to authenticated
using (reporter_id = auth.uid() or public.is_marketplace_admin());

create policy "Admins moderate reports"
on public.listing_reports for update to authenticated
using (public.is_marketplace_admin())
with check (public.is_marketplace_admin());
