alter table "public"."room_booking" alter column "status" drop default;

alter type "public"."room_booking_status" rename to "room_booking_status__old_version_to_be_dropped";

create type "public"."room_booking_status" as enum ('needs_approval', 'cancelled', 'active', 'rejected', 'scheduled');

alter table "public"."room_booking" alter column status type "public"."room_booking_status" using status::text::"public"."room_booking_status";

alter table "public"."room_booking" alter column "status" set default 'needs_approval'::room_booking_status;

drop type "public"."room_booking_status__old_version_to_be_dropped";

create policy "anon_can_select"
on "public"."room"
as permissive
for select
to anon
using (true);



