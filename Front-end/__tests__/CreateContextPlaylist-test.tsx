import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import CreateContextPlaylistScreen from '@/app/CreateContextPlaylistScreen';
import * as SecureStore from 'expo-secure-store';
import getRandomSongsByContext from '@/fetchAPI/getRandomSongsByContext';
import { usePlayer } from '@/app/PlayerContext';

// Mock expo-router with explicit jest.fn for hooks to ensure they are functions
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({
    contextName: 'Work',
    contextIcon: '💼',
    contextColor: '#00FF00',
    songsData: undefined as string | undefined,
  })),
}));

const mockPlayList = jest.fn();
const mockExpand = jest.fn();

jest.mock('@/app/PlayerContext', () => ({
  usePlayer: jest.fn(() => ({
    playTrack: jest.fn(),
    playList: mockPlayList,
    miniPlayerRef: { current: { expand: mockExpand } },
  })),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

jest.mock('@/fetchAPI/getRandomSongsByContext', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@expo-google-fonts/montserrat', () => ({
  useFonts: () => [true],
}));

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

jest.mock('@react-native-async-storage/async-storage', () => 
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/Components/Header', () => () => null);

jest.mock('@/app/src/historyHelper', () => ({
  addToHistory: jest.fn(),
}));

// Get the mocked hooks for overriding in tests
const { useLocalSearchParams } = require('expo-router') as {
  useLocalSearchParams: jest.Mock;
};
const { useRouter } = require('expo-router') as {
  useRouter: jest.Mock;
};

const mockSongs = [
  {
    songId: '1',
    title: 'Song One',
    artist: 'Artist One',
    image_url: 'https://example.com/img1.jpg',
  },
  {
    songId: '2',
    title: 'Song Two',
    artist: 'Artist Two',
    image_url: 'https://example.com/img2.jpg',
  },
];

describe('CreateContextPlaylistScreen', () => {
  const defaultParams = {
    contextName: 'Work',
    contextIcon: '💼',
    contextColor: '#00FF00',
    songsData: undefined as string | undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useLocalSearchParams.mockReturnValue(defaultParams);

    const mockRouterInstance = {
      push: jest.fn(),
      back: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouterInstance);

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('valid-token');
    (getRandomSongsByContext as jest.Mock).mockResolvedValue({
      success: true,
      data: mockSongs,
    });
  });

  it('renders correctly with context params and empty song list initially', () => {
    const screen = render(<CreateContextPlaylistScreen />);

    expect(screen.getByText('Create Context Playlist')).toBeTruthy();
    expect(screen.getByText('Work')).toBeTruthy();
    expect(screen.getByText('No songs found for this context.')).toBeTruthy();
  });

  it('loads initial songs from params if provided', async () => {
    useLocalSearchParams.mockReturnValue({
      ...defaultParams,
      songsData: JSON.stringify(mockSongs),
    });

    const screen = render(<CreateContextPlaylistScreen />);

    await waitFor(() => {
      expect(screen.getByText('Song One')).toBeTruthy();
      expect(screen.getByText('Song Two')).toBeTruthy();
    });
  });

  it('shows loading spinner and refreshes songs on refresh button press', async () => {
    const screen = render(<CreateContextPlaylistScreen />);

    const refreshButton = screen.getByTestId('ionicon-refresh').parent!;
    fireEvent.press(refreshButton);

    expect(screen.getByText('Generating Playlist...')).toBeTruthy();

    await waitFor(() => {
      expect(getRandomSongsByContext).toHaveBeenCalledWith('valid-token', 'Work');
      expect(screen.getByText('Song One')).toBeTruthy();
    });
  });

  it('plays all songs when play all button is pressed', async () => {
    useLocalSearchParams.mockReturnValue({
      ...defaultParams,
      songsData: JSON.stringify(mockSongs),
    });

    const screen = render(<CreateContextPlaylistScreen />);

    await waitFor(() => expect(screen.getByTestId('ionicon-play')).toBeTruthy());

    const playAllButton = screen.getByTestId('ionicon-play').parent?.parent!;
    fireEvent.press(playAllButton);

    expect(mockExpand).toHaveBeenCalled();
    expect(mockPlayList).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ track_id: '1', title: 'Song One' }),
        expect.objectContaining({ track_id: '2', title: 'Song Two' }),
      ]),
      0
    );
  });

  it('plays individual song when song row is pressed', async () => {
    useLocalSearchParams.mockReturnValue({
      ...defaultParams,
      songsData: JSON.stringify(mockSongs),
    });

    const screen = render(<CreateContextPlaylistScreen />);

    await waitFor(() => expect(screen.getByText('Song One')).toBeTruthy());

    fireEvent.press(screen.getByText('Song One'));

    expect(mockExpand).toHaveBeenCalled();
    expect(mockPlayList).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ track_id: '1' }),
        expect.objectContaining({ track_id: '2' }),
      ]),
      0
    );
  });

  it('navigates to CreatePlaylist screen when add button is pressed', async () => {
    useLocalSearchParams.mockReturnValue({
      ...defaultParams,
      songsData: JSON.stringify(mockSongs),
    });

    const screen = render(<CreateContextPlaylistScreen />);

    await waitFor(() => expect(screen.getByTestId('ionicon-add-outline')).toBeTruthy());

    const addButton = screen.getByTestId('ionicon-add-outline').parent!;
    fireEvent.press(addButton);

    const routerInstance = useRouter();
    expect(routerInstance.push).toHaveBeenCalledWith({
      pathname: '/CreatePlaylist',
      params: {
        songsData: JSON.stringify(mockSongs),
        defaultTitle: 'Work Mix',
      },
    });
  });

  it('navigates back when back button is pressed', () => {
    const screen = render(<CreateContextPlaylistScreen />);

    const backButton = screen.getByTestId('ionicon-chevron-back').parent!;
    fireEvent.press(backButton);

    const routerInstance = useRouter();
    expect(routerInstance.back).toHaveBeenCalled();
  });

  it('handles refresh failure gracefully', async () => {
    (getRandomSongsByContext as jest.Mock).mockResolvedValue({ success: false });

    const screen = render(<CreateContextPlaylistScreen />);

    const refreshButton = screen.getByTestId('ionicon-refresh').parent!;
    fireEvent.press(refreshButton);

    await waitFor(() => {
      expect(getRandomSongsByContext).toHaveBeenCalled();
      expect(screen.queryByText('Generating Playlist...')).toBeNull();
    });
  });
});