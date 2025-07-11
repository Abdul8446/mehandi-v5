import { StandardCheckoutClient, Env } from "pg-sdk-node";
import { randomUUID } from "crypto";

const clientId = process.env.PHONEPE_CLIENT_ID as string;
const clientSecret = process.env.PHONEPE_CLIENT_SECRET as string;
const clientVersion = 1 as number;
const env = Env.PRODUCTION; // Change to Env.PRODUCTION when going live

export const getClient = () => {
  return StandardCheckoutClient.getInstance(
    clientId,
    clientSecret,
    clientVersion,
    env
  );
};

export { randomUUID };