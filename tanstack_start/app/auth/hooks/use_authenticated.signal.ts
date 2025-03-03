import { signal } from "@preact/signals";
import { useEffect } from "react";

export const authenticated = signal(false);

export async function checkAuthenticated(): Promise<boolean> {
  const session = { data: { session: "" } };
  if (!session.data.session) {
    authenticated.value = false;
    return false;
  }

  authenticated.value = true;
  return true;
}

export function useAuthenticated() {
  useEffect(() => {
    true;
  }, []);
}
