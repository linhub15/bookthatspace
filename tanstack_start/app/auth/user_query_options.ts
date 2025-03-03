import { queryOptions } from "@tanstack/react-query";
import { supabase } from "../clients/supabase";

export const userQueryOptions = queryOptions({
  queryKey: ["supabase", "user"],
  queryFn: () => supabase.auth.getUser(),
});
