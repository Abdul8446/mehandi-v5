// lib/phonepe.config.ts
interface PhonePeConfig {
  webhookUsername: string;
  webhookPassword: string;
  merchantId?: string; // Optional, can be added if needed
  clientId?: string; // Optional, can be added if needed}
  clientSecret?: string; // Optional, can be added if 
  clientVersion?: string; // Optional, can be added if needed
}
  
const phonepeConfig: PhonePeConfig = {
  webhookUsername: process.env.PHONEPE_WEBHOOK_USERNAME || '',
  webhookPassword: process.env.PHONEPE_WEBHOOK_PASSWORD || '',
  merchantId: process.env.PHONEPE_MERCHANT_ID || '',
  clientId: process.env.PHONEPE_CLIENT_ID || '',
  clientSecret: process.env.PHONEPE_CLIENT_SECRET || '',
  clientVersion: process.env.PHONEPE_CLIENT_VERSION || '1', // Default to '
};

export default phonepeConfig;