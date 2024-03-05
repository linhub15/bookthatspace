create table "public"."user_provider" (
    "id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "refresh_token" text not null,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."user_provider" enable row level security;

CREATE UNIQUE INDEX user_provider_pkey ON public.user_provider USING btree (id);

alter table "public"."user_provider" add constraint "user_provider_pkey" PRIMARY KEY using index "user_provider_pkey";

alter table "public"."user_provider" add constraint "user_provider_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_provider" validate constraint "user_provider_id_fkey";

grant delete on table "public"."user_provider" to "anon";

grant insert on table "public"."user_provider" to "anon";

grant references on table "public"."user_provider" to "anon";

grant select on table "public"."user_provider" to "anon";

grant trigger on table "public"."user_provider" to "anon";

grant truncate on table "public"."user_provider" to "anon";

grant update on table "public"."user_provider" to "anon";

grant delete on table "public"."user_provider" to "authenticated";

grant insert on table "public"."user_provider" to "authenticated";

grant references on table "public"."user_provider" to "authenticated";

grant select on table "public"."user_provider" to "authenticated";

grant trigger on table "public"."user_provider" to "authenticated";

grant truncate on table "public"."user_provider" to "authenticated";

grant update on table "public"."user_provider" to "authenticated";

grant delete on table "public"."user_provider" to "service_role";

grant insert on table "public"."user_provider" to "service_role";

grant references on table "public"."user_provider" to "service_role";

grant select on table "public"."user_provider" to "service_role";

grant trigger on table "public"."user_provider" to "service_role";

grant truncate on table "public"."user_provider" to "service_role";

grant update on table "public"."user_provider" to "service_role";

create policy "owner_can_all"
on "public"."user_provider"
as permissive
for all
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



