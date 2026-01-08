import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import components to test
import EmailScreen from '@/app/src/signin/EmailInput'; // Adjust path based on your structure
import LoginScreen from '@/app/src/signin/Login';
import Otpsign from '@/app/src/signin/Otpsign';
import SignupScreen from '@/app/src/signin/Signup';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/fetchAPI/signupAPI', () => ({
  signupStep1: jest.fn(),
  signupStep2: jest.fn(),
  verifyOTP: jest.fn(),
  resendOTP: jest.fn(),
}));

jest.mock('@/fetchAPI/loginAPI', () => jest.fn());

jest.mock('@/Components/background', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockBackground = ({ children }: any) => <View testID="mock-background">{children}</View>;
  MockBackground.displayName = 'MockBackground';
  return MockBackground;
});

jest.mock('@/Components/NextBackButton', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  const MockNextBackButton = ({ onNextPage, onBackPage }: any) => (
    <View>
      <TouchableOpacity testID="next-button" onPress={onNextPage}><Text>Next</Text></TouchableOpacity>
      <TouchableOpacity testID="back-button" onPress={onBackPage}><Text>Back</Text></TouchableOpacity>
    </View>
  );
  MockNextBackButton.displayName = 'MockNextBackButton';
  return MockNextBackButton;
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock global alert for Login.tsx
global.alert = jest.fn() as jest.Mock;

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { TouchableOpacity, View } = require('react-native');
  return {
    MaterialCommunityIcons: (props: any) => (
      <TouchableOpacity testID="mock-icon" onPress={props.onPress}>
        <View />
      </TouchableOpacity>
    ),
  };
});

const mockSignupStep1 = require('@/fetchAPI/signupAPI').signupStep1 as jest.Mock;
const mockSignupStep2 = require('@/fetchAPI/signupAPI').signupStep2 as jest.Mock;
const mockVerifyOTP = require('@/fetchAPI/signupAPI').verifyOTP as jest.Mock;
const mockResendOTP = require('@/fetchAPI/signupAPI').resendOTP as jest.Mock;
const mockLoginAPI = require('@/fetchAPI/loginAPI') as jest.Mock;

describe('SignIn SignUp Process Components', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (global.alert as jest.Mock).mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      navigate: jest.fn(),
      back: jest.fn(),
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('EmailScreen (EmailInput.tsx)', () => {
    beforeEach(() => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ username: 'testuser', password: 'testpass' });
    });

    it('renders correctly', () => {
      const { getByText, getByPlaceholderText } = render(<EmailScreen />);
      expect(getByText('Enter Your Email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByText('By creating an account, you agree to the Terms and Privacy Policy')).toBeTruthy();
    });

    it('shows alert when email is empty on next', async () => {
      const { getByTestId } = render(<EmailScreen />);
      fireEvent.press(getByTestId('next-button'));
      expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập email');
    });

    it('calls signupStep2 and navigates on valid email', async () => {
      mockSignupStep2.mockResolvedValue({});
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

      const { getByPlaceholderText, getByTestId } = render(<EmailScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.press(getByTestId('next-button'));

      await waitFor(() => {
        expect(mockSignupStep2).toHaveBeenCalledWith({ contact: 'test@example.com' });
        expect(mockPush).toHaveBeenCalledWith({
          pathname: '/src/signin/Otpsign',
          params: { email: 'test@example.com', username: 'testuser', password: 'testpass' },
        });
      });
    });

    it('shows alert on signupStep2 error', async () => {
      mockSignupStep2.mockRejectedValue(new Error('Error message'));
      const { getByPlaceholderText, getByTestId } = render(<EmailScreen />);
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.press(getByTestId('next-button'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Gửi OTP thất bại', 'Error message');
      });
    });

    it('navigates back on back button press', () => {
      const mockBack = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

      const { getByTestId } = render(<EmailScreen />);
      fireEvent.press(getByTestId('back-button'));
      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('LoginScreen (Login.tsx)', () => {
    it('renders correctly', () => {
      const { getByText, getByPlaceholderText } = render(<LoginScreen />);
      expect(getByText('MoodyBlue')).toBeTruthy();
      expect(getByText('All your music in one place.')).toBeTruthy();
      expect(getByPlaceholderText('Insert your username')).toBeTruthy();
      expect(getByPlaceholderText('Insert your password')).toBeTruthy();
      expect(getByText('Remember me')).toBeTruthy();
      expect(getByText('LOGIN')).toBeTruthy();
      expect(getByText("Don't have an account? Sign Up")).toBeTruthy();
    });

    it('toggles password visibility', () => {
      const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
      let passwordInput = getByPlaceholderText('Insert your password');
      expect(passwordInput.props.secureTextEntry).toBe(true);

      fireEvent.press(getByTestId('mock-icon'));
      passwordInput = getByPlaceholderText('Insert your password');
      expect(passwordInput.props.secureTextEntry).toBe(false);
    });

    it('toggles remember me checkbox', () => {
      const { getByText } = render(<LoginScreen />);
      fireEvent.press(getByText('Remember me'));
      // Note: Visual state change, but we can check if pressable
    });

    it('disables login button when fields empty', () => {
      const { UNSAFE_getAllByType } = render(<LoginScreen />);
      const buttons = UNSAFE_getAllByType(TouchableOpacity);
      expect(buttons[2].props.disabled).toBe(true);
    });

    it('calls loginAPI and navigates on success', async () => {
      mockLoginAPI.mockResolvedValue({});
      const mockNavigate = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'user');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass');
      fireEvent.press(getByText('LOGIN'));

      await waitFor(() => {
        expect(mockLoginAPI).toHaveBeenCalledWith('user', 'pass');
        expect(mockNavigate).toHaveBeenCalledWith('/HomeScreen');
      });
    });

    it('shows alert on login failure', async () => {
      mockLoginAPI.mockRejectedValue(new Error());
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'user');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass');
      fireEvent.press(getByText('LOGIN'));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Đăng nhập thất bại. Kiểm tra username/password.');
      });
    });

    it('navigates to Signup on link press', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

      const { getByText } = render(<LoginScreen />);
      fireEvent.press(getByText('Sign Up'));
      expect(mockPush).toHaveBeenCalledWith('/src/signin/Signup');
    });
  });

  describe('Otpsign (Otpsign.tsx)', () => {
    beforeEach(() => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('renders correctly', () => {
      const { getByText } = render(<Otpsign />);
      expect(getByText('Enter OTP')).toBeTruthy();
      expect(getByText(' We sent an SMS with a 4-digit Code to your email')).toBeTruthy();
      expect(getByText('Next')).toBeTruthy();
      expect(getByText('Resend OTP')).toBeTruthy();
      expect(getByText('Edit Email')).toBeTruthy();
    });

    it('handles OTP input changes', () => {
      const { UNSAFE_getAllByType } = render(<Otpsign />);
      const inputs = UNSAFE_getAllByType(TextInput);
      fireEvent.changeText(inputs[0], '1');
      expect(inputs[0].props.value).toBe('1');
    });

    it('shows alert on incomplete OTP', () => {
      const { getByText } = render(<Otpsign />);
      fireEvent.press(getByText('Next'));
      expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Vui lòng nhập đủ 4 chữ số OTP');
    });

    it('calls verifyOTP and navigates on success', async () => {
      mockVerifyOTP.mockResolvedValue({});
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

      const { UNSAFE_getAllByType, getByText } = render(<Otpsign />);
      const inputs = UNSAFE_getAllByType(TextInput);
      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');
      fireEvent.changeText(inputs[3], '4');
      fireEvent.press(getByText('Next'));

      await waitFor(() => {
        expect(mockVerifyOTP).toHaveBeenCalledWith({ otp: '1234' });
        expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'Tài khoản đã được tạo thành công!');
        expect(mockPush).toHaveBeenCalledWith({
          pathname: '/src/signin/Typesong',
          params: { username: 'testuser', password: 'testpass' },
        });
      });
    });

    it('shows alert on verifyOTP error', async () => {
      mockVerifyOTP.mockRejectedValue(new Error('Error message'));
      const { UNSAFE_getAllByType, getByText } = render(<Otpsign />);
      const inputs = UNSAFE_getAllByType(TextInput);
      fireEvent.changeText(inputs[0], '1');
      fireEvent.changeText(inputs[1], '2');
      fireEvent.changeText(inputs[2], '3');
      fireEvent.changeText(inputs[3], '4');
      fireEvent.press(getByText('Next'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('OTP sai', 'Error message');
      });
    });

    it('calls resendOTP on resend press', async () => {
      mockResendOTP.mockResolvedValue({});
      const { getByText } = render(<Otpsign />);
      fireEvent.press(getByText('Resend OTP'));

      await waitFor(() => {
        expect(mockResendOTP).toHaveBeenCalledWith({ contact: 'test@example.com' });
        expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'OTP mới đã được gửi lại đến email của bạn!');
      });
    });

    it('shows alert on resendOTP error', async () => {
      mockResendOTP.mockRejectedValue(new Error('Error message'));
      const { getByText } = render(<Otpsign />);
      fireEvent.press(getByText('Resend OTP'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Thất bại', 'Error message');
      });
    });

    it('shows alert if no email for resend', async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({});
      const { getByText } = render(<Otpsign />);
      fireEvent.press(getByText('Resend OTP'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Lỗi', 'Không tìm thấy email. Vui lòng quay lại bước trước.');
      });
    });
  });

  describe('SignupScreen (Signup.tsx)', () => {
    it('renders correctly', () => {
      const { getByText, getByPlaceholderText } = render(<SignupScreen />);
      expect(getByText('MoodyBlue')).toBeTruthy();
      expect(getByText('Welcome to Moody Blue')).toBeTruthy();
      expect(getByPlaceholderText('Insert your username')).toBeTruthy();
      expect(getByPlaceholderText('Insert your password')).toBeTruthy();
      expect(getByPlaceholderText('Confirm password')).toBeTruthy();
      expect(getByText('Remember me')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
      expect(getByText('Already have an account? Log In')).toBeTruthy();
    });

    it('shows password mismatch error', async () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<SignupScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass1');
      fireEvent.changeText(getByPlaceholderText('Confirm password'), 'pass2');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(queryByText('Passwords do not match!')).toBeTruthy();
      });
    });

    it('clears password error on confirm change', async () => {
      const { getByPlaceholderText, getByText, queryByText } = render(<SignupScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'testuser');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass1');
      fireEvent.changeText(getByPlaceholderText('Confirm password'), 'pass2');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(queryByText('Passwords do not match!')).toBeTruthy();
      });

      fireEvent.changeText(getByPlaceholderText('Confirm password'), 'pass1');
      expect(queryByText('Passwords do not match!')).toBeNull();
    });

    it('disables sign up button when username or password empty', () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = render(<SignupScreen />);
      let buttons = UNSAFE_getAllByType(TouchableOpacity);
      expect(buttons[3].props.disabled).toBe(true);

      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'user');
      buttons = UNSAFE_getAllByType(TouchableOpacity);
      expect(buttons[3].props.disabled).toBe(true); // Still disabled without password
    });

    it('calls signupStep1 and navigates on success', async () => {
      mockSignupStep1.mockResolvedValue({});
      const mockNavigate = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      const { getByPlaceholderText, getByText } = render(<SignupScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'user');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass');
      fireEvent.changeText(getByPlaceholderText('Confirm password'), 'pass');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(mockSignupStep1).toHaveBeenCalledWith({
          username: 'user',
          password: 'pass',
          passwordConfirm: 'pass',
        });
        expect(mockNavigate).toHaveBeenCalledWith({
          pathname: '/src/signin/EmailInput',
          params: { 
            username: 'user',
            password: 'pass'
          },
        });
      });
    });

    it('shows alert on signupStep1 error', async () => {
      mockSignupStep1.mockRejectedValue(new Error('Error message'));
      const { getByPlaceholderText, getByText } = render(<SignupScreen />);
      fireEvent.changeText(getByPlaceholderText('Insert your username'), 'user');
      fireEvent.changeText(getByPlaceholderText('Insert your password'), 'pass');
      fireEvent.changeText(getByPlaceholderText('Confirm password'), 'pass');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Đăng ký thất bại', 'Error message');
      });
    });

    it('navigates to Login on link press', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

      const { getByText } = render(<SignupScreen />);
      fireEvent.press(getByText('Log In'));
      expect(mockPush).toHaveBeenCalledWith('/src/signin/Login');
    });
  });
});