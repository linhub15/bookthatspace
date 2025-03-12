import { Html } from "@react-email/components";

type Props = {
  url: string;
  name: string;
};

const BookingRejected = (props: Props) => (
  <Html>
    <p>
      Hi {props.name},
    </p>
    <p>
      Your booking has been rejected. You can view the updates here. {props.url}
    </p>
  </Html>
);

export default BookingRejected;
