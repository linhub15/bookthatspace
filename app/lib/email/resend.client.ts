import { Resend } from "resend";
import type { Mailer, SendArgs } from "./mailer.types";

const EMAIL_DOMAIN = "birdy.dev";

class ResendClient implements Mailer {
  #client: Resend;
  constructor() {
    this.#client = new Resend(process.env.RESEND_API_KEY);
  }

  async send(args: SendArgs): Promise<void> {
    const response = await this.#client.emails.send({
      from: `BookThatSpace <no-reply@${EMAIL_DOMAIN}>`,
      ...args,
    });

    if (response.error) {
      throw new Error(response.error.name, { cause: response.error.message });
    }

    console.info("email sent:", response.data?.id);
  }
}

export const mailer = new ResendClient();
