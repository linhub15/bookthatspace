import { Enums } from "@/lib/types/supabase_types";

/** ISO 8601 Monday is 1 */
export const mapNumberToDayOfWeek: Record<number, Enums<"day_of_week">> = {
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
  7: "sun",
};

export const mapDayOfWeekToNumber = {
  "mon": 1,
  "tue": 2,
  "wed": 3,
  "thu": 4,
  "fri": 5,
  "sat": 6,
  "sun": 7,
};
