create policy "anon_can_read"
on "public"."room_booking"
as permissive
for select
to anon
using (true);



