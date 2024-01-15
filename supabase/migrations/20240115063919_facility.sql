
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "supabase_migrations";

ALTER SCHEMA "supabase_migrations" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."day_of_week" AS ENUM (
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun'
);

ALTER TYPE "public"."day_of_week" OWNER TO "postgres";

CREATE TYPE "public"."room_booking_status" AS ENUM (
    'needs_approval',
    'cancelled',
    'active',
    'rejected',
    'scheduled'
);

ALTER TYPE "public"."room_booking_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_profile_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO public.profile
  (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email);

  UPDATE auth.users
  SET raw_user_meta_data = null
  WHERE id = NEW.id;

  RETURN NEW;
END;$$;

ALTER FUNCTION "public"."create_profile_on_signup"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."facility" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "address" "jsonb",
    "name" "text"
);

ALTER TABLE "public"."facility" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profile" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "email" character varying NOT NULL
);

ALTER TABLE "public"."profile" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."room" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "max_capacity" numeric,
    "address" "text",
    "hourly_rate" numeric,
    "facility_id" "uuid" NOT NULL
);

ALTER TABLE "public"."room" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."room_availability" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "day_of_week" "public"."day_of_week" NOT NULL,
    "start" time without time zone NOT NULL,
    "end" time without time zone NOT NULL
);

ALTER TABLE "public"."room_availability" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."room_booking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start" timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    "room_id" "uuid" NOT NULL,
    "booked_by_email" "text" NOT NULL,
    "status" "public"."room_booking_status" DEFAULT 'needs_approval'::"public"."room_booking_status" NOT NULL,
    "total_cost" numeric,
    "description" "text",
    "booked_by_name" "text" NOT NULL,
    CONSTRAINT "room_booking_total_cost_check" CHECK (("total_cost" >= (0)::numeric))
);

ALTER TABLE "public"."room_booking" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."room_photo" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "path" "text" NOT NULL
);

ALTER TABLE "public"."room_photo" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "supabase_migrations"."schema_migrations" (
    "version" "text" NOT NULL,
    "statements" "text"[],
    "name" "text"
);

ALTER TABLE "supabase_migrations"."schema_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "public"."room_booking"
    ADD CONSTRAINT "calendar_event_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."facility"
    ADD CONSTRAINT "facility_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."room_availability"
    ADD CONSTRAINT "room_availability_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."room_photo"
    ADD CONSTRAINT "room_photo_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."room"
    ADD CONSTRAINT "room_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");

ALTER TABLE ONLY "public"."facility"
    ADD CONSTRAINT "facility_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."room_availability"
    ADD CONSTRAINT "room_availability_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."room_booking"
    ADD CONSTRAINT "room_booking_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."room"
    ADD CONSTRAINT "room_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "public"."facility"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."room_photo"
    ADD CONSTRAINT "room_photo_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE CASCADE;

CREATE POLICY "Profile viewable by creator" ON "public"."profile" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));

CREATE POLICY "anon_can_create" ON "public"."room_booking" FOR INSERT TO "anon" WITH CHECK (("booked_by_email" IS NOT NULL));

CREATE POLICY "anon_can_select" ON "public"."room" FOR SELECT TO "anon" USING (true);

ALTER TABLE "public"."facility" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_can_all" ON "public"."facility" TO "authenticated" USING (("auth"."uid"() = "profile_id")) WITH CHECK (("auth"."uid"() = "profile_id"));

CREATE POLICY "owner_can_all" ON "public"."room" TO "authenticated" USING (("auth"."uid"() = ( SELECT "facility"."profile_id"
   FROM "public"."facility"
  WHERE ("facility"."id" = "room"."facility_id")))) WITH CHECK (true);

CREATE POLICY "owner_can_all" ON "public"."room_availability" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_availability"."room_id")))) WITH CHECK (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_availability"."room_id"))));

CREATE POLICY "owner_can_all" ON "public"."room_booking" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_booking"."room_id")))) WITH CHECK (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_booking"."room_id"))));

CREATE POLICY "owner_can_all" ON "public"."room_photo" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_photo"."room_id")))) WITH CHECK (("auth"."uid"() IN ( SELECT "facility"."profile_id"
   FROM ("public"."facility"
     JOIN "public"."room" ON (("room"."facility_id" = "facility"."id")))
  WHERE ("room"."id" = "room_photo"."room_id"))));

CREATE POLICY "owner_can_create" ON "public"."profile" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));

ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."room" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."room_availability" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."room_booking" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."room_photo" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile_on_signup"() TO "service_role";

GRANT ALL ON TABLE "public"."facility" TO "anon";
GRANT ALL ON TABLE "public"."facility" TO "authenticated";
GRANT ALL ON TABLE "public"."facility" TO "service_role";

GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";

GRANT ALL ON TABLE "public"."room" TO "anon";
GRANT ALL ON TABLE "public"."room" TO "authenticated";
GRANT ALL ON TABLE "public"."room" TO "service_role";

GRANT ALL ON TABLE "public"."room_availability" TO "anon";
GRANT ALL ON TABLE "public"."room_availability" TO "authenticated";
GRANT ALL ON TABLE "public"."room_availability" TO "service_role";

GRANT ALL ON TABLE "public"."room_booking" TO "anon";
GRANT ALL ON TABLE "public"."room_booking" TO "authenticated";
GRANT ALL ON TABLE "public"."room_booking" TO "service_role";

GRANT ALL ON TABLE "public"."room_photo" TO "anon";
GRANT ALL ON TABLE "public"."room_photo" TO "authenticated";
GRANT ALL ON TABLE "public"."room_photo" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
