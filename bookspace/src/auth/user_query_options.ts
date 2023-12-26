import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../supabase";

export const userQueryOptions = queryOptions({
  queryKey: ["supabase", "user"],
  queryFn: () => supabase.auth.getUser(),
});
