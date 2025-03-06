create table "public"."google_calendar" (
    "id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "profile_id" uuid not null default auth.uid(),
    "sync_enabled" boolean not null default false,
    "events" jsonb not null,
    "sync_channel_id" uuid,
    "sync_channel_expiry" timestamp with time zone
);


alter table "public"."google_calendar" enable row level security;

alter table "public"."room" add column "google_calendar_id" text;

CREATE UNIQUE INDEX google_calendar_pkey ON public.google_calendar USING btree (id);

alter table "public"."google_calendar" add constraint "google_calendar_pkey" PRIMARY KEY using index "google_calendar_pkey";

alter table "public"."google_calendar" add constraint "google_calendar_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profile(id) not valid;

alter table "public"."google_calendar" validate constraint "google_calendar_profile_id_fkey";

alter table "public"."room" add constraint "room_google_calendar_id_fkey" FOREIGN KEY (google_calendar_id) REFERENCES google_calendar(id) ON DELETE SET NULL not valid;

alter table "public"."room" validate constraint "room_google_calendar_id_fkey";

grant delete on table "public"."google_calendar" to "anon";

grant insert on table "public"."google_calendar" to "anon";

grant references on table "public"."google_calendar" to "anon";

grant select on table "public"."google_calendar" to "anon";

grant trigger on table "public"."google_calendar" to "anon";

grant truncate on table "public"."google_calendar" to "anon";

grant update on table "public"."google_calendar" to "anon";

grant delete on table "public"."google_calendar" to "authenticated";

grant insert on table "public"."google_calendar" to "authenticated";

grant references on table "public"."google_calendar" to "authenticated";

grant select on table "public"."google_calendar" to "authenticated";

grant trigger on table "public"."google_calendar" to "authenticated";

grant truncate on table "public"."google_calendar" to "authenticated";

grant update on table "public"."google_calendar" to "authenticated";

grant delete on table "public"."google_calendar" to "service_role";

grant insert on table "public"."google_calendar" to "service_role";

grant references on table "public"."google_calendar" to "service_role";

grant select on table "public"."google_calendar" to "service_role";

grant trigger on table "public"."google_calendar" to "service_role";

grant truncate on table "public"."google_calendar" to "service_role";

grant update on table "public"."google_calendar" to "service_role";

create policy "owner_can_all"
on "public"."google_calendar"
as permissive
for all
to authenticated
using ((auth.uid() = profile_id))
with check ((auth.uid() = profile_id));
