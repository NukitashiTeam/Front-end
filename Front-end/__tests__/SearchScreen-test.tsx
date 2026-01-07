import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TextInput, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import SearchScreen from '@/app/SearchScreen'; // Adjust path based on your structure
import searchSongsByKeyword from '@/fetchAPI/SearchMusic';
import getAllMoods from '@/fetchAPI/getAllMoods';
import getUserContexts from '@/fetchAPI/getContextUserHome'; // Fixed path based on console logs
import { refreshTokenUse } from '@/fetchAPI/loginAPI';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
      playAsync: jest.fn().mockResolvedValue(undefined),
      pauseAsync: jest.fn().mockResolvedValue(undefined),
      stopAsync: jest.fn().mockResolvedValue(undefined),
      setPositionAsync: jest.fn().mockResolvedValue(undefined),
      getStatusAsync: jest.fn().mockResolvedValue({
        isLoaded: true,
        positionMillis: 0,
        durationMillis: 100000,
        isPlaying: false,
      }),
      setOnPlaybackStatusUpdate: jest.fn(),
    })),
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  },
  InterruptionModeIOS: {
    Default: 0,
    DoNotMix: 1,
    DuckOthers: 2,
  },
  InterruptionModeAndroid: {
    Default: 0,
    DoNotMix: 1,
    DuckOthers: 2,
  },
}));
jest.mock('@/app/PlayerContext', () => ({
  usePlayer: jest.fn(() => ({
    currentTrack: null,
    isPlaying: false,
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    setCurrentTrack: jest.fn(),
  })),
  PlayerProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID={`ionicon-${props.name}`} />,
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children?: React.ReactNode }) => children || null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('@expo-google-fonts/montserrat', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@/fetchAPI/getAllMoods', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/getContextUserHome', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/fetchAPI/SearchMusic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => 
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/fetchAPI/loginAPI', () => ({
  refreshTokenUse: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('../Components/Header', () => () => null);

const mockRouter = {
  push: jest.fn(),
  navigate: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

const mockMoods = [
  { _id: '1', name: 'happy', color: '#FF0000', icon: '😊' },
];

const mockContexts = [
  { _id: '1', name: 'Work', color: '#00FF00', icon: '💼' },
];

describe('SearchScreen', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
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
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('token');
    (getAllMoods as jest.Mock).mockResolvedValue(mockMoods);
    (getUserContexts as jest.Mock).mockResolvedValue(mockContexts);
    (searchSongsByKeyword as jest.Mock).mockResolvedValue([
      { track_id: '1', title: 'Song1', artist: 'Artist1', image_url: 'url1' },
    ]);
  });

  it('renders correctly', async () => {
    const { getByPlaceholderText, getByText, findByText, getAllByText } = render(<SearchScreen />);
    expect(getByPlaceholderText('Find By Name, Artists or Mood')).toBeTruthy();
    expect(getByText('All Mood Playlist')).toBeTruthy();
    expect(getByText('Context Playlist')).toBeTruthy();
    expect(getByText("Recent Playlist's Song")).toBeTruthy();

    await findByText('😊');

    const workTexts = getAllByText('Work');
    expect(workTexts.length).toBeGreaterThan(0);
  });

  it('handles search', async () => {
    const { getByPlaceholderText, findByText } = render(<SearchScreen />);
    const input = getByPlaceholderText('Find By Name, Artists or Mood');
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await findByText('Song1');
    expect(searchSongsByKeyword).toHaveBeenCalledWith('test', 10);
  });

  it('shows loading during data fetch', () => {
    (getAllMoods as jest.Mock).mockResolvedValueOnce(new Promise(() => {})); // Pending
    const { UNSAFE_getAllByType } = render(<SearchScreen />);
    expect(UNSAFE_getAllByType(ActivityIndicator).length).toBeGreaterThan(0);
  });

  it('handles no moods or contexts', async () => {
    (getAllMoods as jest.Mock).mockResolvedValue([]);
    (getUserContexts as jest.Mock).mockResolvedValue([]);
    const { findByText } = render(<SearchScreen />);

    await findByText('No contexts found');
  });

  it('navigates to mood playlist on press', async () => {
    const { findByText } = render(<SearchScreen />);

    const moodIcon = await findByText('😊');
    fireEvent.press(moodIcon.parent!.parent!);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: '/CreateMoodPlaylistScreen',
        params: { moodName: 'happy' },
      });
    });
  });

  it('navigates to show more moods', () => {
    const { getByText } = render(<SearchScreen />);
    fireEvent.press(getByText('Show more'));
    expect(mockRouter.navigate).toHaveBeenCalledWith('/ChoosingMoodPlayScreen');
  });

  it('navigates to see all contexts', () => {
    const { getByText } = render(<SearchScreen />);
    fireEvent.press(getByText('See all context'));
    expect(mockRouter.navigate).toHaveBeenCalledWith('/ContextUserListScreen');
  });

  it('handles search error', async () => {
    (searchSongsByKeyword as jest.Mock).mockRejectedValue(new Error());
    console.error = jest.fn();

    const { getByPlaceholderText } = render(<SearchScreen />);
    const input = getByPlaceholderText('Find By Name, Artists or Mood');
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Search error:', expect.any(Error));
    });
  });

  it('handles back from search mode', async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(<SearchScreen />);
    const input = getByPlaceholderText('Find By Name, Artists or Mood');
    fireEvent.changeText(input, 'test');
    fireEvent(input, 'submitEditing');

    const backIcon = await waitFor(() => getByTestId('ionicon-arrow-back'));
    fireEvent.press(backIcon.parent!);
    await findByText('All Mood Playlist');
  });
});