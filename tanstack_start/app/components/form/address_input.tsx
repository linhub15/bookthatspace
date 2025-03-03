import { Address } from "@/lib/types/address";
import { Json } from "@/app/clients/supabase";
import { Label } from "./label";
import { cn } from "@/lib/utils/cn";
import { FormField } from "./form_field";

const countries = ["Canada"];

const administrative_divisions: { [key: string]: string[] } = {
  "Canada": [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Ontario",
    "Prince Edward Island",
    "Saskatchewan",
  ],
};

type Props = {
  value: Json;
  onChange: (value: Address) => void;
};

export function AddressInput(props: Props) {
  const address = props.value as Address;

  const change = (value: Partial<Address>) => {
    const changed = { ...address, ...value };
    props.onChange(changed);
  };

  return (
    <div className="space-y-4">
      <FormField>
        <Label>Address</Label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          value={address.address}
          onChange={(e) => change({ address: e.target.value })}
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField>
          <Label>City</Label>
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text"
            value={address.city}
            onChange={(e) => change({ city: e.target.value })}
          />
        </FormField>

        <FormField>
          <Label>Country</Label>
          <select
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={address.country}
            onChange={(e) => change({ country: e.target.value })}
          >
            <option value=""></option>
            {countries.map((country) => (
              <option
                key={country}
                value={country}
                selected={country === address.country}
              >
                {country}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField>
          <Label>Province</Label>
          <select
            className={cn(
              {
                "disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200":
                  !address.country,
              },
              "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            )}
            value={address.administrative_division}
            onChange={(e) =>
              change({ administrative_division: e.currentTarget.value })}
            disabled={!address.country}
          >
            {address.country && (
              <>
                <option value=""></option>
                {administrative_divisions[address.country]?.map((division) => (
                  <option
                    key={division}
                    value={division}
                    selected={division === address.administrative_division}
                  >
                    {division}
                  </option>
                ))}
              </>
            )}
          </select>
        </FormField>

        <FormField>
          <Label>Postal Code</Label>
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text"
            value={address.postal_code?.toUpperCase()}
            maxLength={7}
            onChange={(e) =>
              change({
                postal_code: e.target.value?.toUpperCase().replaceAll(" ", ""),
              })}
          />
        </FormField>
      </div>
    </div>
  );
}

export function AddressDisplay({ value }: { value: Address | null }) {
  if (!value) return;

  const withCommas = (...values: string[]) => values.filter(Boolean).join(", ");

  return (
    <div>
      <div>{value.address}</div>
      <div>{withCommas(value.city, value.administrative_division)}</div>
      <div>{withCommas(value.country, value.postal_code)}</div>
    </div>
  );
}
