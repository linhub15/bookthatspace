import { Html } from "@react-email/components";

type Props = {
  url: string;
  name: string;
};

const BookingAccepted = (props: Props) => (
  <Html>
    <p>
      Hi {props.name},
    </p>
    <p>
      Your booking has been accepted. You can view the updates here. {props.url}
    </p>
  </Html>
);

export default BookingAccepted;
