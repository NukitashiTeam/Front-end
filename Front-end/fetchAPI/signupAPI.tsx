// src/api/authApi.ts

const BASE_URL = 'https://moody-blue-597542124573.asia-southeast2.run.app';

type SignupStep1Payload = {
  username: string;
  password: string;
  passwordConfirm: string;
};

type SignupStep2Payload = {
  contact: string; // email
};

type VerifyOTPPayload = {
  otp: string;
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

  return data; // { message: "Bước 1 hoàn tất" }
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

  return data; // { message: "OTP đã được gửi đến email của bạn" }
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

  return data; // Thành công thì thường trả về token hoặc thông tin user
};