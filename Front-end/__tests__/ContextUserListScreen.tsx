import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import ContextUserListScreen from '@/app/ContextUserListScreen';
import getUserContexts from '@/fetchAPI/getUserContexts';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useFocusEffect: (callback: () => void) => {
    const { useEffect } = require('react');
    useEffect(callback, []);
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@/fetchAPI/getUserContexts', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@expo-google-fonts/montserrat', () => ({
  useFonts: jest.fn(() => [true]),
}));

// Ionicons mock with testID
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID={`ionicon-${props.name}`} {...props} />,
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => children || null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('@/Components/Header', () => () => null);

jest.mock('@/styles/ContextUserListStyles', () => ({}));

const mockPush = jest.fn();
const mockBack = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  back: mockBack,
});

const mockContexts = [
  { _id: '1', name: 'Work Focus', icon: '💼', color: '#00FF00' },
  { _id: '2', name: 'Study Time', icon: '📚', color: '#FF4500' },
  { _id: '3', name: 'Gym Session', icon: '🏋️', color: '#FFD700' },
];

describe('ContextUserListScreen', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Suppress act warnings and unmounted update warnings
    console.error = (...args: any[]) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('not wrapped in act') ||
         message.includes("Can't perform a React state update on a component that hasn't mounted yet"))
      ) {
        return;
      }
      originalConsoleError(...args);
    };
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('valid-token');
    (getUserContexts as jest.Mock).mockResolvedValue(mockContexts);
  });

//   it('renders loading indicator initially', async () => {
//     (getUserContexts as jest.Mock).mockImplementation(() => new Promise(() => {})); // Pending

//     const { getAllByType } = render(<ContextUserListScreen />);
//     expect(getAllByType(ActivityIndicator).length).toBeGreaterThan(0);
//   });

  it('renders screen title, search input, and create button', async () => {
    const { getByText, getByPlaceholderText } = render(<ContextUserListScreen />);

    await waitFor(() => {
      expect(getByText('My Context')).toBeTruthy();
      expect(getByPlaceholderText("Context 's Name")).toBeTruthy();
      expect(getByText('Create Your Own')).toBeTruthy();
    });
  });

  it('renders list of user contexts', async () => {
    const { getByText } = render(<ContextUserListScreen />);

    await waitFor(() => {
      expect(getByText('Work Focus')).toBeTruthy();
      expect(getByText('Study Time')).toBeTruthy();
      expect(getByText('Gym Session')).toBeTruthy();
    });
  });

  it('navigates to ContextConfigScreen in config mode when pressing a context card', async () => {
    const { getByText } = render(<ContextUserListScreen />);

    await waitFor(() => expect(getByText('Work Focus')).toBeTruthy());

    fireEvent.press(getByText('Work Focus'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/ContextConfigScreen',
      params: {
        mode: 'config',
        contextId: '1',
      },
    });
  });

  it('navigates to ContextConfigScreen in create mode when pressing create button', async () => {
    const { getByText } = render(<ContextUserListScreen />);

    await waitFor(() => expect(getByText('Create Your Own')).toBeTruthy());

    fireEvent.press(getByText('Create Your Own'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/ContextConfigScreen',
      params: {
        mode: 'create',
        isEdit: 'false',
      },
    });
  });

  it('navigates back when pressing back button', async () => {
    const { getByTestId } = render(<ContextUserListScreen />);

    const backIcon = getByTestId('ionicon-chevron-back');
    const backButton = backIcon.parent!;

    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('renders empty state message when no contexts', async () => {
    (getUserContexts as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<ContextUserListScreen />);

    await waitFor(() => {
      expect(getByText("You don't have any context yet. Create one!")).toBeTruthy();
    });
  });

  it('handles missing token gracefully (logs message, no crash)', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<ContextUserListScreen />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Không tìm thấy accessToken, vui lòng đăng nhập lại.");
    });

    consoleSpy.mockRestore();
  });
});