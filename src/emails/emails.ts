// src/emails/mailTrap.config.ts
import { MailtrapClient } from "mailtrap";
import env from "@/lib/envalid.js";

export const mailTrapClient = new MailtrapClient({
  token: env.MAILTRAP_TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Your App Name",
};
