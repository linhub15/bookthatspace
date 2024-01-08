import { supabase } from "../../supabase";
import { authenticated } from "../../auth/use_authenticated.signal";
import { Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/src/components/card";
import { useProfile } from "@/src/profile/hooks";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export function Profile() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  if (!profile) return null;

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
              {profile.name}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {profile.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">
              Public booking link
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 space-x-4">
              <span className="font-mono pt-1 pb-0.5 px-3 bg-gray-200 rounded-lg">
                {`${window.location.protocol}//${window.location.host}/s/${profile.id}`}
              </span>
              <Link
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                to="/s/$profile_id"
                target="_blank"
                params={{ profile_id: profile.id }}
              >
                View <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
              </Link>
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
