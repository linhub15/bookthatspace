import { SubmitButton } from "@/app/components/buttons/submit_button";
import { AddressInput } from "@/app/components/form/address_input";
import { FormField } from "@/app/components/form/form_field";
import { Label } from "@/app/components/form/label";
import { useProfile } from "@/app/features/profile/use_profile";
import { type Address, zAddress } from "@/lib/types/address";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  upsertFacilityFn,
  type UpsertFacilityRequest,
} from "./upsert_facility.fn";
import { useFacility } from "./use_facility";

type Props = {
  onAfterSubmit: () => void;
  onCancel: () => void;
};

type FacilityForm = {
  name: string;
  address: Partial<Address>;
};

export function FacilityForm(props: Props) {
  const { data: profile } = useProfile();
  const { data: facility } = useFacility();
  const upsertFacility = useUpsertFacility();
  const form = useForm({
    defaultValues: {
      name: facility?.name,
      address: facility?.address,
    } as FacilityForm,
    onSubmit: async (form) => {
      await upsertFacility.mutateAsync({
        profileId: profile?.id,
        id: facility?.id ?? undefined,
        name: form.value.name,
        address: zAddress.parse(form.value.address),
      }, {
        onSuccess: () => {
          props.onAfterSubmit();
        },
      });
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await form.handleSubmit();
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <form.Field name="name">
        {(field) => (
          <FormField>
            <Label htmlFor={field.name}>Facility Name</Label>
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="text"
              name={field.name}
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <FormField>
            <Label className="sr-only" htmlFor={field.name}>Address</Label>
            <AddressInput
              value={field.state.value}
              onChange={(e) => field.handleChange(e)}
            />
          </FormField>
        )}
      </form.Field>

      <div className="pt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <form.Subscribe>
          {(state) => (
            <>
              <SubmitButton pending={state.isSubmitting}>Save</SubmitButton>
              <button
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                type="button"
                onClick={props.onCancel}
                disabled={state.isSubmitting}
              >
                Cancel
              </button>
            </>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

function useUpsertFacility() {
  const queryClient = useQueryClient();
  const upsertFacility = useServerFn(upsertFacilityFn);

  const mutation = useMutation({
    mutationFn: async (value: UpsertFacilityRequest) => {
      const upserted = await upsertFacility({ data: value });

      queryClient.setQueryData(["facility"], upserted);

      return upserted;
    },
  });

  return mutation;
}
