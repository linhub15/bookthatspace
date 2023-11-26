import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { authenticated } from "../auth/use_authenticated.signal";
import { useNavigate } from "@tanstack/react-router";

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const set = async () => {
      const aProfile = await supabase.from("profile").select("*");
      setProfile(aProfile.data);
    };
    set();
  }, []);
  return (
    <div>
      Profile page
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      {authenticated.value &&
        (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              authenticated.value = false;
              navigate({ to: "/" });
            }}
          >
            Sign Out
          </button>
        )}
    </div>
  );
}
