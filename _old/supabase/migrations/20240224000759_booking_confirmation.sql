alter table "public"."room" drop column "address";

alter table "public"."room_booking" add column "email_confirmed_at" timestamp with time zone;


