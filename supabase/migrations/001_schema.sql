create extension if not exists pg_trgm;
create table profiles(id uuid primary key references auth.users on delete cascade, full_name text, email text, phone text, avatar_url text, suspended bool default false, created_at timestamptz default now());
create table user_roles(id uuid primary key default gen_random_uuid(), user_id uuid references profiles on delete cascade, role text check(role in('customer','seller','vet','admin')), created_at timestamptz default now(), unique(user_id,role));
create table categories(id serial primary key, name text not null, pet_type text, parent_id int references categories);
create table products(id uuid primary key default gen_random_uuid(), seller_id uuid not null references profiles, category_id int references categories, title text not null check(length(title)>2), description text, pet_type text, brand text, price numeric(10,2) not null check(price>=0), currency text default 'USD', condition text check(condition in('new','used')), location text, status text default 'active' check(status in('active','sold','unavailable','removed')), created_at timestamptz default now(), updated_at timestamptz default now());
create table product_images(id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade, image_url text not null, sort_order int default 0);
create table clinics(id uuid primary key default gen_random_uuid(), owner_id uuid references profiles, name text not null, description text, address text, latitude float8, longitude float8, phone text, opening_hours jsonb, services text[] default '{}', verification_status text default 'unverified' check(verification_status in('unverified','pending','verified','rejected')), created_at timestamptz default now());
create table reviews(id uuid primary key default gen_random_uuid(), reviewer_id uuid references profiles, target_type text check(target_type in('seller','clinic')), target_id uuid not null, rating int check(rating between 1 and 5), comment text, created_at timestamptz default now(), unique(reviewer_id,target_type,target_id), check(reviewer_id<>target_id));
create table conversations(id uuid primary key default gen_random_uuid(), created_at timestamptz default now(), updated_at timestamptz default now());
create table conversation_participants(id uuid primary key default gen_random_uuid(), conversation_id uuid references conversations on delete cascade, user_id uuid references profiles, unique(conversation_id,user_id));
create table messages(id uuid primary key default gen_random_uuid(), conversation_id uuid references conversations on delete cascade, sender_id uuid references profiles, content text not null, created_at timestamptz default now(), read_at timestamptz);
create table wishlists(id uuid primary key default gen_random_uuid(), user_id uuid references profiles on delete cascade, product_id uuid references products on delete cascade, created_at timestamptz default now(), unique(user_id,product_id));
create table reports(id uuid primary key default gen_random_uuid(), reporter_id uuid references profiles, target_type text not null, target_id uuid not null, reason text not null, description text, evidence_path text, status text default 'submitted' check(status in('submitted','under_review','resolved','rejected')), admin_notes text, created_at timestamptz default now(), updated_at timestamptz default now());
create table verification_requests(id uuid primary key default gen_random_uuid(), user_id uuid references profiles, business_type text, submitted_documents text[], status text default 'pending', reviewed_by uuid references profiles, created_at timestamptz default now(), reviewed_at timestamptz);
create table notifications(id uuid primary key default gen_random_uuid(), user_id uuid references profiles on delete cascade, type text, title text, message text, read_at timestamptz, created_at timestamptz default now());
create table audit_log(id uuid primary key default gen_random_uuid(), admin_id uuid, action text, target_type text, target_id uuid, details jsonb, created_at timestamptz default now());
create index on products(status,created_at desc); create index on products(category_id); create index on products using gin(title gin_trgm_ops);
create index on messages(conversation_id,created_at); create index on reports(status);

create or replace function is_admin() returns bool language sql security definer stable set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin') $$;
create or replace function in_conv(c uuid) returns bool language sql security definer stable set search_path = public as $$ select exists(select 1 from public.conversation_participants where conversation_id=c and user_id=auth.uid()) $$;
create or replace function new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin
 insert into public.profiles(id,email,full_name) values(new.id,new.email,new.raw_user_meta_data->>'full_name');
 insert into public.user_roles(user_id,role) values(new.id,'customer'); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function new_user();

do $$ declare t text; begin foreach t in array array['profiles','user_roles','categories','products','product_images','clinics','reviews','conversations','conversation_participants','messages','wishlists','reports','verification_requests','notifications','audit_log'] loop execute format('alter table %I enable row level security',t); end loop; end $$;

create policy p_read on profiles for select using(true);
create policy p_upd on profiles for update using(id=auth.uid()) with check(id=auth.uid() and suspended=(select suspended from profiles where id=auth.uid()));
create policy r_own on user_roles for select using(user_id=auth.uid() or is_admin());  -- no insert/update policy: roles are server/admin only
create policy c_read on categories for select using(true);
create policy pr_read on products for select using(status in('active','sold') or seller_id=auth.uid() or is_admin());
create policy pr_ins on products for insert with check(seller_id=auth.uid() and exists(select 1 from user_roles where user_id=auth.uid() and role in('seller','admin')));
create policy pr_upd on products for update using(seller_id=auth.uid() or is_admin());
create policy pr_del on products for delete using(seller_id=auth.uid() or is_admin());
create policy pi_read on product_images for select using(true);
create policy pi_write on product_images for all using(exists(select 1 from products p where p.id=product_id and p.seller_id=auth.uid())) with check(exists(select 1 from products p where p.id=product_id and p.seller_id=auth.uid()));
create policy cl_read on clinics for select using(true);
create policy cl_upd on clinics for update using(owner_id=auth.uid() or is_admin()) with check(owner_id=auth.uid() or is_admin()); -- verification_status guarded by trigger below
create policy cl_ins on clinics for insert with check(owner_id=auth.uid() and verification_status='unverified');
create policy rv_read on reviews for select using(true);
create policy rv_ins on reviews for insert with check(reviewer_id=auth.uid());
create policy cv_read on conversations for select using(in_conv(id));
create policy cp_read on conversation_participants for select using(in_conv(conversation_id));
create policy m_read on messages for select using(in_conv(conversation_id));
create policy m_ins on messages for insert with check(sender_id=auth.uid() and in_conv(conversation_id));
create policy m_upd on messages for update using(in_conv(conversation_id) and sender_id<>auth.uid());
create policy w_all on wishlists for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy rp_ins on reports for insert with check(reporter_id=auth.uid() and status='submitted');
create policy rp_read on reports for select using(reporter_id=auth.uid() or is_admin());
create policy vr_ins on verification_requests for insert with check(user_id=auth.uid() and status='pending');
create policy vr_read on verification_requests for select using(user_id=auth.uid() or is_admin());
create policy n_own on notifications for select using(user_id=auth.uid());
create policy n_upd on notifications for update using(user_id=auth.uid());
create policy a_read on audit_log for select using(is_admin());

create function guard_clinic() returns trigger language plpgsql as $$ begin
 if new.verification_status<>old.verification_status and not is_admin() and auth.uid() is not null then raise exception 'verification is admin-only'; end if; return new; end $$;
create trigger clinic_guard before update on clinics for each row execute function guard_clinic();
insert into categories(name) values('Pet Food & Treats'),('Toys'),('Cages, Tanks & Habitats'),('Beds & Furniture'),('Grooming & Hygiene'),('Collars, Leashes & Accessories'),('Travel & Carriers'),('Health & Care Supplies');
