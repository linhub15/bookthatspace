import { supabase } from "../../supabase";
import { authenticated } from "../../auth/use_authenticated.signal";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "../../types/supabase_types";
import { Card } from "@/src/components/card";

export function Profile() {
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select();
      if (error) {
        alert(error.message);
        return;
      }

      return data.at(0) as Tables<"profile">;
    },
  });

  return (
    <Card>
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Account details and settings.
        </p>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {profile?.name}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {profile?.email}
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        {authenticated.value &&
          (
            <button
              className="bg-red-600 rounded text-white py-2 px-4 w-fit"
              type="button"
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
    </Card>
  );
}
