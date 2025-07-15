// For API Responses
export type SendOtpResponse = {
  Status: "Success" | "Error";
  Details: string; // Session ID
};

export type VerifyOtpResponse = {
  Status: "Success" | "Error";
  Details: string;
};

// For API Requests
export type SendOtpRequest = {
  phone: string;
};

export type VerifyOtpRequest = {
  sessionId: string;
  otp: string;
};