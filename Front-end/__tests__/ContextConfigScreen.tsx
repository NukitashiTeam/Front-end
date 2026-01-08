import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import ContextConfigScreen from '@/app/ContextConfigScreen';
import getAllMoods from '@/fetchAPI/getAllMoods';
import getDetailContext from '@/fetchAPI/getDetailContext';
import getRandomSongsByContext from '@/fetchAPI/getRandomSongsByContext';
import createContext from '@/fetchAPI/createContext';
import updateContext from '@/fetchAPI/updateContext';
import deleteUserContext from '@/fetchAPI/deleteUserContext';
import { refreshTokenUse } from '@/fetchAPI/loginAPI';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@/fetchAPI/getAllMoods', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/getDetailContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/getRandomSongsByContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/createContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/updateContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/deleteUserContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/loginAPI', () => ({
  refreshTokenUse: jest.fn(),
}));

// Fixed emoji picker mock
jest.mock('rn-emoji-keyboard', () => {
  const React = require('react');
  // cspell:disable-next-line
  const { Pressable, View } = require('react-native');

  const MockEmojiPicker = (props: any) => {
    if (!props.open) return null;

    return (
      // cspell:disable-next-line
      <Pressable
        testID="mock-emoji-picker"
        onPress={() => {
          props.onEmojiSelected({ emoji: '🚀' });
          if (props.onClose) props.onClose();
        }}
      >
        <View />
      </Pressable>
    );
  };

  MockEmojiPicker.displayName = 'MockEmojiPicker';

  return MockEmojiPicker;
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => children || null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('@/Components/Header', () => () => null);

jest.mock('@/styles/ContextConfigScreenStyles', () => ({}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

const mockMoods = [
  { _id: '1', icon: '😊', displayName: 'Happy' },
  { _id: '2', icon: '😢', displayName: 'Sad' },
  { _id: '3', icon: '❤️', displayName: 'Love' },
  { _id: '4', icon: '🔥', displayName: 'Energetic' },
  { _id: '5', icon: '😎', displayName: 'Cool' },
];

const mockContextDetail = {
  name: 'Existing Work',
  icon: '💼',
  color: '#00FF00',
  moods: mockMoods.slice(0, 3),
};

describe('ContextConfigScreen', () => {
  const originalConsoleError = console.error;
  const alertSpy = jest.spyOn(Alert, 'alert');

  beforeAll(() => {
    // Suppress act warnings
    console.error = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('not wrapped in act')) {
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
    alertSpy.mockImplementation(() => {});
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('valid-token');
    (getAllMoods as jest.Mock).mockResolvedValue(mockMoods);
    (useLocalSearchParams as jest.Mock).mockReturnValue({ mode: 'create' });
    (createContext as jest.Mock).mockResolvedValue({ success: true });
    (updateContext as jest.Mock).mockResolvedValue({ success: true });
  });

  it('renders correctly in create mode', async () => {
    const { getByText, getByPlaceholderText } = render(<ContextConfigScreen />);

    await waitFor(() => {
      expect(getByText('Your Context Name')).toBeTruthy();
      expect(getByPlaceholderText('Studying')).toBeTruthy();
      expect(getByText('Choose Background Color')).toBeTruthy();
      expect(getByText('Consist Of:')).toBeTruthy();
      expect(getByText('Choose Context\'s Mood')).toBeTruthy();
      expect(getByText('*Need at least 3 moods')).toBeTruthy();
      expect(getByText('Create')).toBeTruthy();
    });
  });

  it('loads and displays context details in config (view) mode', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'config',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);

    render(<ContextConfigScreen />);

    await waitFor(() => {
      expect(screen.queryByText('Existing Work')).toBeTruthy();
      expect(screen.queryAllByText('Happy').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Sad').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Love').length).toBeGreaterThan(0);
      expect(screen.queryByText('Edit Context')).toBeTruthy();
      expect(screen.queryByText('Create Playlist')).toBeTruthy();
      expect(screen.queryByText('Delete Context')).toBeTruthy();
    });
  });

  it('loads existing data into form in edit mode (mode=create + isEdit=true)', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'create',
      isEdit: 'true',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);

    render(<ContextConfigScreen />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Work')).toBeTruthy();
      expect(screen.queryAllByText('Happy').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Sad').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Love').length).toBeGreaterThan(0);
      expect(screen.queryByText('Save Changes')).toBeTruthy();
    });
  });

  it('opens emoji picker, selects an emoji, closes picker, and updates icon', async () => {
    const { queryByTestId } = render(<ContextConfigScreen />);

    const initialIconText = screen.getByText('📚');
    expect(initialIconText).toBeTruthy();

    fireEvent.press(initialIconText);

    await waitFor(() => expect(queryByTestId('mock-emoji-picker')).toBeTruthy());
    fireEvent.press(queryByTestId('mock-emoji-picker')!);

    await waitFor(() => {
      expect(queryByTestId('mock-emoji-picker')).toBeNull();
      expect(screen.queryByText('🚀')).toBeTruthy();
    });
  });

  it('toggles mood selection correctly', async () => {
    render(<ContextConfigScreen />);

    await waitFor(() => expect(screen.queryByText('Happy')).toBeTruthy());

    const happyMoodCell = screen.getByText('Happy').parent!;

    fireEvent.press(happyMoodCell);
    fireEvent.press(happyMoodCell);
  });

  it('creates a new context when save is pressed (with minimum required moods)', async () => {
    const { getByPlaceholderText } = render(<ContextConfigScreen />);

    fireEvent.changeText(getByPlaceholderText('Studying'), 'Gym Time');

    await waitFor(() => {
      fireEvent.press(screen.getByText('Happy').parent!);
      fireEvent.press(screen.getByText('Sad').parent!);
      fireEvent.press(screen.getByText('Love').parent!);
    });

    fireEvent.press(screen.getByText('Create'));

    await waitFor(() => {
      expect(createContext).toHaveBeenCalledWith('valid-token', expect.objectContaining({
        name: 'Gym Time',
        moods: expect.arrayContaining(['1', '2', '3']),
      }));
    });
  });

  it('updates existing context when save is pressed in edit mode', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'create',
      isEdit: 'true',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);

    render(<ContextConfigScreen />);

    await waitFor(() => expect(screen.getByDisplayValue('Existing Work')).toBeTruthy());

    fireEvent.changeText(screen.getByDisplayValue('Existing Work'), 'Updated Work');

    fireEvent.press(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(updateContext).toHaveBeenCalledWith('valid-token', '123', expect.objectContaining({
        name: 'Updated Work',
      }));
    });
  });

  it('generates playlist and navigates to playlist screen in config mode', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'config',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);
    (getRandomSongsByContext as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ songId: '1', title: 'Focus Song' }],
    });

    render(<ContextConfigScreen />);

    await waitFor(() => expect(screen.getByText('Create Playlist')).toBeTruthy());
    fireEvent.press(screen.getByText('Create Playlist'));

    await waitFor(() => {
      expect(getRandomSongsByContext).toHaveBeenCalledWith('valid-token', 'Existing Work');
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/CreateContextPlaylistScreen',
        params: expect.objectContaining({
          contextName: 'Existing Work',
          contextIcon: '💼',
          contextColor: '#00FF00',
          songsData: expect.any(String),
        }),
      });
    });
  });

  it('shows alert when playlist generation fails in config mode', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'config',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);
    (getRandomSongsByContext as jest.Mock).mockResolvedValue({ success: false });

    render(<ContextConfigScreen />);

    await waitFor(() => expect(screen.getByText('Create Playlist')).toBeTruthy());
    fireEvent.press(screen.getByText('Create Playlist'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Thông báo', 'Không tìm thấy bài hát phù hợp cho ngữ cảnh này.');
    });
  });

  it('deletes context after confirmation in config mode', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      mode: 'config',
      contextId: '123',
    });
    (getDetailContext as jest.Mock).mockResolvedValue(mockContextDetail);
    (deleteUserContext as jest.Mock).mockResolvedValue({ success: true });

    alertSpy.mockImplementation((title, message, buttons) => {
      buttons?.[1]?.onPress?.(); // Confirm (Xóa)
    });

    render(<ContextConfigScreen />);

    // Wait for the delete button to appear after loading
    await waitFor(() => expect(screen.getByText('Delete Context')).toBeTruthy());

    // Press the text directly – this works reliably for buttons where Text is direct child of Pressable/Touchable
    fireEvent.press(screen.getByText('Delete Context'));

    await waitFor(() => {
      expect(deleteUserContext).toHaveBeenCalledWith('valid-token', '123');
    });
  });

  it('handles token refresh and retries fetching moods when initial call fails (returns null)', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('old-token');
    (refreshTokenUse as jest.Mock).mockResolvedValue('new-token');

    (getAllMoods as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValue(mockMoods);

    render(<ContextConfigScreen />);

    await waitFor(() => {
      expect(refreshTokenUse).toHaveBeenCalled();
      expect(getAllMoods).toHaveBeenCalledTimes(2);
    });
  });
});