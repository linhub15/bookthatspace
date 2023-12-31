alter table "public"."room" drop column "hourly_cost";

alter table "public"."room" add column "hourly_rate" numeric;


