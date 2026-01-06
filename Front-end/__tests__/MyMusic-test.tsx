import MyMusic from "@/app/MyMusic"; // Adjust path if needed
import { fireEvent, render, waitFor, act } from "@testing-library/react-native";
import React from "react";
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, TouchableOpacity } from "react-native";

// Mock dependencies
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("../fetchAPI/getAllPlaylist", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../fetchAPI/loginAPI", () => ({
  refreshTokenUse: jest.fn(),
}));

const mockGetAllPlaylist = require("../fetchAPI/getAllPlaylist").default;
const mockRefreshTokenUse = require("../fetchAPI/loginAPI").refreshTokenUse;

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
  useFocusEffect: jest.fn(),
}));

// Mock Header with named component to satisfy ESLint react/display-name
jest.mock("../Components/Header", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockHeader = () => <View testID="mock-header" />;
  MockHeader.displayName = 'MockHeader'; // Optional, but ensures display name

  return MockHeader;
});

// Mock MainBackground with named component to satisfy ESLint react/display-name
jest.mock("../Components/MainBackground", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockBackground = ({ children }: any) => <View testID="mock-background">{children}</View>;
  MockBackground.displayName = 'MockBackground'; // Optional

  return MockBackground;
});

// Mock useSafeAreaInsets
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

describe("MyMusic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("valid-token");
  });

  const triggerFocus = () => {
    act(() => {
      const [[callback]] = require("expo-router").useFocusEffect.mock.calls;
      callback();
    });
  };

  it("renders loading indicator initially", async () => {
    let resolver: ((value: any) => void) | undefined;
    mockGetAllPlaylist.mockImplementation(() => new Promise((resolve) => { resolver = resolve; }));

    const { UNSAFE_getByType } = render(<MyMusic />);

    triggerFocus();

    const loadingIndicator = UNSAFE_getByType(ActivityIndicator);
    expect(loadingIndicator).toBeTruthy();

    // Resolve to clean up and avoid act warnings
    act(() => {
      if (resolver) resolver([]);
    });
    await waitFor(() => {});
  });

  it("fetches and renders playlists correctly", async () => {
    const mockPlaylists = [
      { _id: "1", title: "Morning Vibes", songs: [{ image_url: "url1" }] },
      { _id: "2", title: "Night Drive", songs: [{ image_url: "url2" }] },
    ];

    mockGetAllPlaylist.mockResolvedValue(mockPlaylists);

    const { getByText } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {
      expect(getByText("Morning Vibes")).toBeTruthy();
      expect(getByText("Night Drive")).toBeTruthy();
    });
  });

  it("navigates to PlaylistSong when pressing a playlist item", async () => {
    const mockPlaylists = [
      { _id: "123", title: "Chillhop Essentials", songs: [{ image_url: "https://example.com/chill.jpg" }] },
    ];

    mockGetAllPlaylist.mockResolvedValue(mockPlaylists);

    const { getByText } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => expect(getByText("Chillhop Essentials")).toBeTruthy());

    fireEvent.press(getByText("Chillhop Essentials"));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: "/PlaylistSong",
      params: {
        id: "123",
        title: "Chillhop Essentials",
        pic: "https://example.com/chill.jpg",
      },
    });
  });

  it("shows 'No playlists found' when there are no playlists", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);

    const { getByText } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {
      expect(getByText("No playlists found. Create one!")).toBeTruthy();
    });
  });

  it("navigates to CreatePlaylist when pressing the plus button", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);

    const { UNSAFE_getByType } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {});

    const plusButton = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(plusButton);

    expect(mockNavigate).toHaveBeenCalledWith("/CreatePlaylist");
  });

  it("handles expired token and refreshes", async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    mockGetAllPlaylist.mockResolvedValueOnce(null); // Simulate expired token
    mockRefreshTokenUse.mockResolvedValue("new-token");
    mockGetAllPlaylist.mockResolvedValueOnce([{ _id: "1", title: "Refreshed Playlist", songs: [] }]);

    const { getByText } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("[MyMusic] Token cũ có thể đã hết hạn, đang thử làm mới...");
      expect(getByText("Refreshed Playlist")).toBeTruthy();
    });

    expect(mockRefreshTokenUse).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("handles no initial token and refreshes", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    mockRefreshTokenUse.mockResolvedValue("new-token");
    mockGetAllPlaylist.mockResolvedValueOnce([{ _id: "1", title: "After Refresh", songs: [] }]);

    const { getByText } = render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {
      expect(getByText("After Refresh")).toBeTruthy();
    });

    expect(mockRefreshTokenUse).toHaveBeenCalled();
  });

  it("logs error when refresh fails", async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    mockRefreshTokenUse.mockResolvedValue(null); // Refresh fails

    render(<MyMusic />);

    triggerFocus();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("[MyMusic] Không thể refresh token.");
    });

    consoleSpy.mockRestore();
  });
});