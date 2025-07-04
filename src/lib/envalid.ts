import { cleanEnv, port, str } from "envalid";
import "dotenv/config";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  JWT_SECRET: str(),
  NODE_ENV: str(),
  MAILTRAP_TOKEN: str(),
  MAILTRAP_ENDPOINT: str(),
});
