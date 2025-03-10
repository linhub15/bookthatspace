import { useForm } from "@tanstack/react-form";
import { useFacility } from "../../../hooks";
import { Label } from "@/components/form/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, TablesInsert } from "@/clients/supabase";
import { AddressInput } from "@/components/form/address_input";
import { FormField } from "@/components/form/form_field";
import { SubmitButton } from "@/components/buttons/submit_button";
import { Address } from "@/lib/types/address";

type Props = {
  profileId: string;
  onAfterSubmit: () => void;
  onCancel: () => void;
};

export function FacilityForm(props: Props) {
  const { data: facility } = useFacility();
  const upsertFacility = useUpsertFacility();
  const form = useForm({
    defaultValues: {
      name: facility?.name ?? undefined,
      address: facility?.address as Address ?? undefined,
    },
    onSubmit: async (form) => {
      await upsertFacility.mutateAsync({
        profile_id: props.profileId,
        id: facility?.id ?? undefined,
        name: form.value.name,
        address: form.value.address,
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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e ?? "")}
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
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
  const mutation = useMutation({
    mutationFn: async (value: TablesInsert<"facility">) => {
      const { data, error } = await supabase.from("facility")
        .upsert(value)
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(["facility"], data);

      return data;
    },
  });

  return mutation;
}
