import { Resend } from "https://esm.sh/resend@2.1.0";
import { getEnv } from "../utils.ts";

const RESEND_API_KEY = getEnv("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

type Args = {
  to: string;
  subject: string;
  html: string;
};

/** @throws Error */
export async function sendEmail(args: Args) {
  const RESEND_FROM_EMAIL = getEnv("RESEND_FROM_EMAIL");

  const response = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: args.to,
    subject: args.subject,
    html: args.html,
  });

  return response;
}
