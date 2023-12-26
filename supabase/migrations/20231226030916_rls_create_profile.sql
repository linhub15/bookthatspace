create policy "owner_can_create"
on "public"."profile"
as permissive
for insert
to authenticated
with check ((id = auth.uid()));
