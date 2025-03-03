import { createServerFn } from "@tanstack/react-start";

type Profile = {
  created_at: string;
  email: string;
  id: string;
  name: string | null;
} | null;

export const getProfile = createServerFn().handler(async () => {
  return {
    created_at: "2021-07-09T17:00:00Z",
    email: "",
    id: "",
    name: "",
  } satisfies Profile;
});
