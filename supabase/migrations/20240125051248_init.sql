create type "public"."day_of_week" as enum ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

create type "public"."room_booking_status" as enum ('needs_approval', 'cancelled', 'active', 'rejected', 'scheduled');

create table "public"."facility" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null,
    "address" jsonb,
    "name" text
);


alter table "public"."facility" enable row level security;

create table "public"."profile" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "email" character varying not null
);


alter table "public"."profile" enable row level security;

create table "public"."room" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text,
    "max_capacity" numeric,
    "address" text,
    "hourly_rate" numeric,
    "facility_id" uuid not null
);


alter table "public"."room" enable row level security;

create table "public"."room_availability" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "room_id" uuid not null,
    "day_of_week" day_of_week not null,
    "start" time without time zone not null,
    "end" time without time zone not null
);


alter table "public"."room_availability" enable row level security;

create table "public"."room_booking" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "start" timestamp with time zone not null,
    "end" timestamp with time zone not null,
    "room_id" uuid not null,
    "booked_by_email" text not null,
    "status" room_booking_status not null default 'needs_approval'::room_booking_status,
    "total_cost" numeric,
    "description" text,
    "booked_by_name" text not null
);


alter table "public"."room_booking" enable row level security;

create table "public"."room_photo" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "room_id" uuid not null,
    "path" text not null
);


alter table "public"."room_photo" enable row level security;

CREATE UNIQUE INDEX calendar_event_pkey ON public.room_booking USING btree (id);

CREATE UNIQUE INDEX facility_pkey ON public.facility USING btree (id);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX room_availability_pkey ON public.room_availability USING btree (id);

CREATE UNIQUE INDEX room_photo_pkey ON public.room_photo USING btree (id);

CREATE UNIQUE INDEX room_pkey ON public.room USING btree (id);

alter table "public"."facility" add constraint "facility_pkey" PRIMARY KEY using index "facility_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."room" add constraint "room_pkey" PRIMARY KEY using index "room_pkey";

alter table "public"."room_availability" add constraint "room_availability_pkey" PRIMARY KEY using index "room_availability_pkey";

alter table "public"."room_booking" add constraint "calendar_event_pkey" PRIMARY KEY using index "calendar_event_pkey";

alter table "public"."room_photo" add constraint "room_photo_pkey" PRIMARY KEY using index "room_photo_pkey";

alter table "public"."facility" add constraint "facility_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE not valid;

alter table "public"."facility" validate constraint "facility_profile_id_fkey";

alter table "public"."profile" add constraint "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_id_fkey";

alter table "public"."room" add constraint "room_facility_id_fkey" FOREIGN KEY (facility_id) REFERENCES facility(id) ON DELETE CASCADE not valid;

alter table "public"."room" validate constraint "room_facility_id_fkey";

alter table "public"."room_availability" add constraint "room_availability_room_id_fkey" FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE not valid;

alter table "public"."room_availability" validate constraint "room_availability_room_id_fkey";

alter table "public"."room_booking" add constraint "room_booking_room_id_fkey" FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE not valid;

alter table "public"."room_booking" validate constraint "room_booking_room_id_fkey";

alter table "public"."room_booking" add constraint "room_booking_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;

alter table "public"."room_booking" validate constraint "room_booking_total_cost_check";

alter table "public"."room_photo" add constraint "room_photo_room_id_fkey" FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE not valid;

alter table "public"."room_photo" validate constraint "room_photo_room_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.profile
  (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email);

  UPDATE auth.users
  SET raw_user_meta_data = null
  WHERE id = NEW.id;

  RETURN NEW;
END;$function$
;

grant delete on table "public"."facility" to "anon";

grant insert on table "public"."facility" to "anon";

grant references on table "public"."facility" to "anon";

grant select on table "public"."facility" to "anon";

grant trigger on table "public"."facility" to "anon";

grant truncate on table "public"."facility" to "anon";

grant update on table "public"."facility" to "anon";

grant delete on table "public"."facility" to "authenticated";

grant insert on table "public"."facility" to "authenticated";

grant references on table "public"."facility" to "authenticated";

grant select on table "public"."facility" to "authenticated";

grant trigger on table "public"."facility" to "authenticated";

grant truncate on table "public"."facility" to "authenticated";

grant update on table "public"."facility" to "authenticated";

grant delete on table "public"."facility" to "service_role";

grant insert on table "public"."facility" to "service_role";

grant references on table "public"."facility" to "service_role";

grant select on table "public"."facility" to "service_role";

grant trigger on table "public"."facility" to "service_role";

grant truncate on table "public"."facility" to "service_role";

grant update on table "public"."facility" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."room" to "anon";

grant insert on table "public"."room" to "anon";

grant references on table "public"."room" to "anon";

grant select on table "public"."room" to "anon";

grant trigger on table "public"."room" to "anon";

grant truncate on table "public"."room" to "anon";

grant update on table "public"."room" to "anon";

grant delete on table "public"."room" to "authenticated";

grant insert on table "public"."room" to "authenticated";

grant references on table "public"."room" to "authenticated";

grant select on table "public"."room" to "authenticated";

grant trigger on table "public"."room" to "authenticated";

grant truncate on table "public"."room" to "authenticated";

grant update on table "public"."room" to "authenticated";

grant delete on table "public"."room" to "service_role";

grant insert on table "public"."room" to "service_role";

grant references on table "public"."room" to "service_role";

grant select on table "public"."room" to "service_role";

grant trigger on table "public"."room" to "service_role";

grant truncate on table "public"."room" to "service_role";

grant update on table "public"."room" to "service_role";

grant delete on table "public"."room_availability" to "anon";

grant insert on table "public"."room_availability" to "anon";

grant references on table "public"."room_availability" to "anon";

grant select on table "public"."room_availability" to "anon";

grant trigger on table "public"."room_availability" to "anon";

grant truncate on table "public"."room_availability" to "anon";

grant update on table "public"."room_availability" to "anon";

grant delete on table "public"."room_availability" to "authenticated";

grant insert on table "public"."room_availability" to "authenticated";

grant references on table "public"."room_availability" to "authenticated";

grant select on table "public"."room_availability" to "authenticated";

grant trigger on table "public"."room_availability" to "authenticated";

grant truncate on table "public"."room_availability" to "authenticated";

grant update on table "public"."room_availability" to "authenticated";

grant delete on table "public"."room_availability" to "service_role";

grant insert on table "public"."room_availability" to "service_role";

grant references on table "public"."room_availability" to "service_role";

grant select on table "public"."room_availability" to "service_role";

grant trigger on table "public"."room_availability" to "service_role";

grant truncate on table "public"."room_availability" to "service_role";

grant update on table "public"."room_availability" to "service_role";

grant delete on table "public"."room_booking" to "anon";

grant insert on table "public"."room_booking" to "anon";

grant references on table "public"."room_booking" to "anon";

grant select on table "public"."room_booking" to "anon";

grant trigger on table "public"."room_booking" to "anon";

grant truncate on table "public"."room_booking" to "anon";

grant update on table "public"."room_booking" to "anon";

grant delete on table "public"."room_booking" to "authenticated";

grant insert on table "public"."room_booking" to "authenticated";

grant references on table "public"."room_booking" to "authenticated";

grant select on table "public"."room_booking" to "authenticated";

grant trigger on table "public"."room_booking" to "authenticated";

grant truncate on table "public"."room_booking" to "authenticated";

grant update on table "public"."room_booking" to "authenticated";

grant delete on table "public"."room_booking" to "service_role";

grant insert on table "public"."room_booking" to "service_role";

grant references on table "public"."room_booking" to "service_role";

grant select on table "public"."room_booking" to "service_role";

grant trigger on table "public"."room_booking" to "service_role";

grant truncate on table "public"."room_booking" to "service_role";

grant update on table "public"."room_booking" to "service_role";

grant delete on table "public"."room_photo" to "anon";

grant insert on table "public"."room_photo" to "anon";

grant references on table "public"."room_photo" to "anon";

grant select on table "public"."room_photo" to "anon";

grant trigger on table "public"."room_photo" to "anon";

grant truncate on table "public"."room_photo" to "anon";

grant update on table "public"."room_photo" to "anon";

grant delete on table "public"."room_photo" to "authenticated";

grant insert on table "public"."room_photo" to "authenticated";

grant references on table "public"."room_photo" to "authenticated";

grant select on table "public"."room_photo" to "authenticated";

grant trigger on table "public"."room_photo" to "authenticated";

grant truncate on table "public"."room_photo" to "authenticated";

grant update on table "public"."room_photo" to "authenticated";

grant delete on table "public"."room_photo" to "service_role";

grant insert on table "public"."room_photo" to "service_role";

grant references on table "public"."room_photo" to "service_role";

grant select on table "public"."room_photo" to "service_role";

grant trigger on table "public"."room_photo" to "service_role";

grant truncate on table "public"."room_photo" to "service_role";

grant update on table "public"."room_photo" to "service_role";

create policy "owner_can_all"
on "public"."facility"
as permissive
for all
to authenticated
using ((auth.uid() = profile_id))
with check ((auth.uid() = profile_id));


create policy "Profile viewable by creator"
on "public"."profile"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "owner_can_create"
on "public"."profile"
as permissive
for insert
to authenticated
with check ((id = auth.uid()));


create policy "anon_can_select"
on "public"."room"
as permissive
for select
to anon
using (true);


create policy "owner_can_all"
on "public"."room"
as permissive
for all
to authenticated
using ((auth.uid() = ( SELECT facility.profile_id
   FROM facility
  WHERE (facility.id = room.facility_id))))
with check (true);


create policy "owner_can_all"
on "public"."room_availability"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_availability.room_id))))
with check ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_availability.room_id))));


create policy "anon_can_create"
on "public"."room_booking"
as permissive
for insert
to anon
with check ((booked_by_email IS NOT NULL));


create policy "owner_can_all"
on "public"."room_booking"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_booking.room_id))))
with check ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_booking.room_id))));


create policy "owner_can_all"
on "public"."room_photo"
as permissive
for all
to authenticated
using ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_photo.room_id))))
with check ((auth.uid() IN ( SELECT facility.profile_id
   FROM (facility
     JOIN room ON ((room.facility_id = facility.id)))
  WHERE (room.id = room_photo.room_id))));



CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();


create policy "owner_can_all a6sew5_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'room-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "owner_can_all a6sew5_1"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'room-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "owner_can_all a6sew5_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'room-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "owner_can_all a6sew5_3"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'room-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



