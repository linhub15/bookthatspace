import { Html } from "@react-email/components";

type Props = {
  url: string;
  name: string;
};

export const BookingCreated = (props: Props) => (
  <Html>
    <p>
      Hi {props.name},
    </p>
    <p>
      Your booking has been created. You can view the updates here. {props.url}
    </p>
  </Html>
);

export default BookingCreated;
