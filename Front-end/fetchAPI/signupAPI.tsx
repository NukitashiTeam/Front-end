// src/api/authApi.ts

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

type SignupStep1Payload = {
  username: string;
  password: string;
  passwordConfirm: string;
};

type SignupStep2Payload = {
  contact: string;
};

type VerifyOTPPayload = {
  otp: string;
};
type ResendOTPPayload = {
  contact: string; 
};
export const signupStep1 = async (payload: SignupStep1Payload) => {
  const response = await fetch(`${BASE_URL}/api/user/signup/step1`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup step 1 failed');
  }

  return data; 
};

export const signupStep2 = async (payload: SignupStep2Payload) => {
  const response = await fetch(`${BASE_URL}/api/user/signup/step2`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }

  return data;
};

export const verifyOTP = async (payload: VerifyOTPPayload) => {
  const response = await fetch(`${BASE_URL}/api/user/verifyOTP`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP không hợp lệ hoặc đã hết hạn');
  }

  return data; 
};
export const resendOTP = async (payload: ResendOTPPayload) => {
  const response = await fetch(`${BASE_URL}/api/user/resendOTP`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // KHÔNG cần Authorization
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gửi lại OTP thất bại');
  }

  return data;
};