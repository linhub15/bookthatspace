import type { Address } from "@/lib/types/address";

type Props = {
  address: Address;
};

export function GoogleMapImg(props: Props) {
  const geocode = (address?: Address) => {
    return `${address?.address}, ${address?.city}, ${address?.administrative_division}, ${address?.postal_code}`;
  };
  const mapUrl = new URL("https://maps.googleapis.com/maps/api/staticmap");
  mapUrl.searchParams.append("center", geocode(props.address));
  mapUrl.searchParams.append("zoom", "15");
  mapUrl.searchParams.append("size", "400x400");
  mapUrl.searchParams.append("key", import.meta.env.VITE_GOOGLE_API_KEY);
  mapUrl.searchParams.append(
    "markers",
    `size:mid|color:red|${geocode(props.address)}`,
  );
  return <img className="object-none" src={mapUrl.toString()} />;
}
