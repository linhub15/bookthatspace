import type { Address } from "@/lib/types/address";
import { createServerFn } from "@tanstack/react-start";

type Facility = {
  created_at: string;
  id: string;
  name: string | null;
  profile_id: string;
  address: Address;
} | null;

export const getFacility = createServerFn().handler(async () => {
  return {
    created_at: "2021-07-09T17:00:00Z",
    id: "",
    name: "",
    profile_id: "",
    address: {
      address: "",
      administrative_division: "",
      city: "",
      country: "",
      postal_code: "",
      version: 0,
    },
  } satisfies Facility;
});
