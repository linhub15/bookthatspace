import { Resend } from "https://esm.sh/resend@2.1.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(RESEND_API_KEY);

type Args = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(args: Args) {
  const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

  if (!RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL is not defined");
  }

  const response = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: args.to,
    subject: args.subject,
    html: args.html,
  });

  return response;
}

export const html = (strings: TemplateStringsArray, ...values: string[]) =>
  String.raw({ raw: strings }, ...values);
