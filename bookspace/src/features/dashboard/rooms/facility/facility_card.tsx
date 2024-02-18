import { Card } from "@/src/components/card";
import { useFacility } from "../../../hooks";
import { useFacilityModal } from "./use_facility_modal";
import { HomeModernIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AddressDisplay } from "@/src/components/form/address_input";
import { Address } from "@/src/types/address";

export function FacilityCard() {
  const facility = useFacility();
  const facilityModal = useFacilityModal();
  return (
    <>
      <Card>
        {facility.isSuccess && !facility.data && (
          <div className="px-4 py-6 sm:px-6 text-center space-y-4">
            <HomeModernIcon className="h-10 w-10 mx-auto text-gray-400" />
            <div>
              <div className="font-bold">No Facility</div>
              <p className="text-sm leading-6 text-gray-500">
                Get started by creating a facility.
              </p>
            </div>
            <button
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              type="button"
              onClick={facilityModal.open}
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Facility
            </button>
          </div>
        )}

        {facility.isSuccess && facility.data && (
          <>
            <div className="px-4 py-6 space-y-4 sm:px-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Facility
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Facility and building information.
                </p>
              </div>
              <div>
                <button
                  className="bg-blue-600 rounded text-white py-2 px-4 w-fit"
                  onClick={facilityModal.open}
                >
                  Edit Facility
                </button>
              </div>
            </div>
            <div className="border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    Facility Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {facility.data.name}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-900">
                    Address
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <AddressDisplay value={facility.data.address as Address} />
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </Card>
      <facilityModal.Modal />
    </>
  );
}
