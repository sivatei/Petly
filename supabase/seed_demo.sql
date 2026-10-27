-- ==============================================================================
-- Petly Demo Data & Trigger Fix
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> Run)
-- ==============================================================================

-- 1. Fix trigger search_path so auth signup and automated user creation work
create or replace function public.is_admin() returns bool language sql security definer stable set search_path = public as $$ 
  select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin'); 
$$;

create or replace function public.in_conv(c uuid) returns bool language sql security definer stable set search_path = public as $$ 
  select exists(select 1 from public.conversation_participants where conversation_id=c and user_id=auth.uid()); 
$$;

create or replace function public.new_user() returns trigger language plpgsql security definer set search_path = public as $$ 
begin
  insert into public.profiles(id, email, full_name) 
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  insert into public.user_roles(user_id, role) 
  values (new.id, 'customer'); 
  
  return new; 
end $$;

-- 2. Verify or insert Categories
insert into categories (name, pet_type) values
  ('Pet Food & Treats', null),
  ('Toys', null),
  ('Cages, Tanks & Habitats', null),
  ('Beds & Furniture', null),
  ('Grooming & Hygiene', null),
  ('Collars, Leashes & Accessories', null),
  ('Travel & Carriers', null),
  ('Health & Care Supplies', null)
on conflict do nothing;

-- 3. Realistic Veterinary Clinics (if not already seeded)
insert into clinics (name, description, address, latitude, longitude, phone, services, opening_hours, verification_status) values
  ('Metropolitan Veterinary Hospital & 24/7 ER', 'Full-service emergency, surgical, and critical care veterinary hospital equipped with modern digital imaging and intensive care.', '410 W 55th St, New York, NY 10019', 40.7674, -73.9877, '+1 (212) 581-8950', ARRAY['Emergency Care', 'Surgery', 'Critical Care', 'Digital X-Ray', 'Ultrasound'], '{"mon_sun": "Open 24 Hours / 7 Days"}'::jsonb, 'verified'),
  ('Oakridge Animal Wellness & Dental Clinic', 'Specializing in preventative wellness examinations, laser dental scaling, feline geriatric care, and low-stress handling techniques.', '158 5th Ave, Brooklyn, NY 11217', 40.6789, -73.9798, '+1 (718) 638-4100', ARRAY['Dental Care', 'Wellness Exams', 'Vaccinations', 'Laser Therapy', 'Microchipping'], '{"mon_fri": "8:00 AM - 7:00 PM", "sat": "9:00 AM - 4:00 PM", "sun": "Closed"}'::jsonb, 'verified'),
  ('Hudson River Pet Clinic & Surgery', 'Compassionate companion veterinary care offering routine vaccinations, soft tissue surgery, oncology consultations, and pet nutrition advice.', '725 10th Ave, New York, NY 10019', 40.7651, -73.9922, '+1 (212) 246-8800', ARRAY['Soft Tissue Surgery', 'Diagnostics & Lab', 'Vaccinations', 'Nutrition Counseling'], '{"mon_fri": "8:30 AM - 6:30 PM", "sat": "9:00 AM - 3:00 PM", "sun": "Closed"}'::jsonb, 'verified'),
  ('Downtown Companion Animal Hospital', 'State-of-the-art veterinary clinic offering in-house lab testing, orthopedic surgery, internal medicine, and comprehensive puppy/kitten wellness programs.', '225 Broadway, New York, NY 10007', 40.7126, -74.0084, '+1 (212) 349-2200', ARRAY['Orthopedic Surgery', 'Internal Medicine', 'In-house Lab', 'Microchipping'], '{"mon_fri": "8:00 AM - 8:00 PM", "sat_sun": "9:00 AM - 5:00 PM"}'::jsonb, 'verified'),
  ('Sunset Valley Exotic Pet & Avian Center', 'One of the few certified avian and exotic mammal veterinary clinics in the area, offering specialized care for birds, reptiles, ferrets, and rabbits.', '88-14 Northern Blvd, Jackson Heights, NY 11372', 40.7558, -73.8821, '+1 (718) 424-2500', ARRAY['Avian Medicine', 'Exotic Pet Care', 'Dental Floating', 'Reptile Care', 'Surgery'], '{"mon_fri": "9:00 AM - 6:00 PM", "sat": "9:00 AM - 2:00 PM", "sun": "Closed"}'::jsonb, 'verified')
on conflict do nothing;
