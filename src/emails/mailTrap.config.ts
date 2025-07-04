import { MailtrapClient } from "mailtrap";
import envalid from "@/lib/envalid";

// Create Mailtrap client with valid configuration
export const mailTrapClient = new MailtrapClient({
  token: envalid.MAILTRAP_TOKEN,
});

// Define sender details
export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Xayotullo",
};
