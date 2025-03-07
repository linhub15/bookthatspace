import { Card } from "@/components/card";
import {
  CheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { facilityRoute, publicBookingRoute } from "../../public/public.routes";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { router } from "@.router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useFacility } from "../../facility_management/facility/use_facility";

export function WidgetIndex() {
  const { data: facility } = useFacility();

  if (!facility) return <NoFacility />;

  const bookingLinkProps = {
    to: publicBookingRoute.to,
    params: { facility_id: facility.id },
  };

  const availabilityLinkProps = {
    to: facilityRoute.to,
    params: { facility_id: facility.id },
  };

  const bookingWidget = `${window.location.host}${
    router.buildLocation(bookingLinkProps).pathname
  }`;

  const availabilityWidget = `${window.location.host}${
    router.buildLocation(availabilityLinkProps).pathname
  }`;

  return (
    <Card>
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Widgets
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Share these links on your webite or put in social media
        </p>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="space-x-4">
              <label className="text-sm font-medium text-gray-900">
                Booking
              </label>
              <Link
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                target="_blank"
                to={bookingLinkProps.to}
                params={bookingLinkProps.params}
              >
                View <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
              </Link>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-xs">
                <input
                  className="block w-full min-w-0 flex-1 rounded-l-md rounded-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  value={bookingWidget}
                  disabled
                />
                <CopyToClipboardBtn value={bookingWidget} />
              </div>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="space-x-4">
              <label className="text-sm font-medium text-gray-900">
                Rooms and availability
              </label>
              <Link
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                target="_blank"
                to={availabilityLinkProps.to}
                params={availabilityLinkProps.params}
              >
                View <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
              </Link>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-xs">
                <input
                  className="block w-full min-w-0 flex-1 rounded-l-md rounded-none border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  value={availabilityWidget}
                  disabled
                />
                <CopyToClipboardBtn value={availabilityWidget} />
              </div>
            </dd>
          </div>
          {
            /* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt>
              <label className="text-sm font-medium text-gray-900">
                Enabled
              </label>
              <p className="mt-1 text-sm leading-6 text-gray-500">
              </p>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <ToggleSwitch value={true} onChange={() => {}} />
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="">
              <div className="">
                <span className="text-sm font-medium text-gray-900">
                  Custom link (coming soon)
                </span>
              </div>
              <p className="text-sm leading-6 text-gray-500">
                Defaults to your profile ID when left empty
              </p>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-xs">
                <input
                  type="text"
                  name="company-website"
                  id="company-website"
                  className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={facility.id}
                  disabled
                />
              </div>
            </dd>
          </div> */
          }
        </dl>
      </div>
    </Card>
  );
}

function NoFacility() {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <p className="text-center text-lg">
          Create facility to enable widget
        </p>
        <Link
          className="mx-auto w-fit block text-nowrap bg-blue-600 rounded-sm text-white py-2 px-4"
          to="/dashboard/profile"
        >
          Create Facility
        </Link>
      </div>
    </Card>
  );
}

function CopyToClipboardBtn(props: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copyLinkToClipboard = async () => {
    await navigator.clipboard.writeText(props.value);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      className={cn(
        "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300",
        copied
          ? "bg-green-500 text-gray-100"
          : "text-gray-700 hover:bg-gray-50",
      )}
      type="button"
      onClick={copyLinkToClipboard}
      title="Copy to clipboard"
    >
      {copied
        ? (
          <CheckIcon
            className="-ml-0.5 h-4 w-4 stroke-2"
            aria-hidden="true"
          />
        )
        : (
          <ClipboardDocumentListIcon
            className="-ml-0.5 h-5 w-5"
            aria-hidden="true"
          />
        )}
    </button>
  );
}
