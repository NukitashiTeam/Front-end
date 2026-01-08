import HomeScreen from "@/app/HomeScreen";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Mock fonts
jest.mock("@expo-google-fonts/irish-grover", () => ({
  useFonts: () => [true],
  IrishGrover_400Regular: {},
}));
jest.mock("@expo-google-fonts/montserrat", () => ({
  useFonts: () => [true],
  Montserrat_400Regular: {},
  Montserrat_700Bold: {},
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock API
jest.mock("../fetchAPI/getAllPlaylist", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../fetchAPI/getAllMoods", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../fetchAPI/loginAPI", () => ({
  refreshTokenUse: jest.fn(),
}));

const mockGetAllPlaylist = require("../fetchAPI/getAllPlaylist").default;
const mockGetAllMoods = require("../fetchAPI/getAllMoods").default;
const mockRefreshTokenUse = require("../fetchAPI/loginAPI").refreshTokenUse;

const mockPush = jest.fn();
const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    navigate: mockNavigate,
    back: jest.fn(),
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

describe("HomeScreen", () => {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeAll(() => {
    console.error = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && (message.includes('not wrapped in act') || message.includes('VirtualizedList'))) {
        return;
      }
      originalConsoleError(...args);
    };

    console.log = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('Random Mood selected')) {
        return;
      }
      originalConsoleLog(...args);
    };
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("valid-token");
  });

  it("renders default components correctly with last mood", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);
    mockGetAllMoods.mockResolvedValue([{ name: "chill", icon: "😌" }]);

    const { getByText, findByText } = render(<HomeScreen />);

    expect(getByText("RECENT PLAYLIST")).toBeTruthy();
    expect(getByText("Last Mood")).toBeTruthy();

    const moodName = await findByText("Chill");
    expect(moodName).toBeTruthy();
  });

  it("renders with no playlists", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);
    mockGetAllMoods.mockResolvedValue([{ name: "chill", icon: "😌" }]);

    const { findByText } = render(<HomeScreen />);

    await findByText("No playlists found");
  });

  // it("handles expired token gracefully", async () => {
  //   const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  //   mockGetAllPlaylist.mockResolvedValueOnce(null);
  //   mockGetAllMoods.mockResolvedValue([]); // Avoid random mood selection and logs

  //   render(<HomeScreen />);

  //   await waitFor(() => {
  //     expect(consoleSpy).toHaveBeenCalledWith("Token cũ có thể đã hết hạn, đang thử đăng nhập lại...");
  //   });

  //   consoleSpy.mockRestore();
  // });

  it("uses fallback mood 'happy' when no last mood", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);
    mockGetAllMoods.mockResolvedValue([]); // No moods → fallback happy

    const { findByText } = render(<HomeScreen />);

    const moodName = await findByText("Happy");
    expect(moodName).toBeTruthy();

    fireEvent.press(moodName);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/CreateMoodPlaylistScreen",
        params: { moodName: "happy" },
      });
    });
  });

  it("navigates to mood playlist when pressing quick start card (with last mood)", async () => {
    mockGetAllPlaylist.mockResolvedValue([]);
    mockGetAllMoods.mockResolvedValue([{ name: "chill", icon: "😌" }]);

    const { findByText } = render(<HomeScreen />);

    const moodName = await findByText("Chill");
    fireEvent.press(moodName);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/CreateMoodPlaylistScreen",
        params: { moodName: "chill" },
      });
    });
  });

  it("performs token refresh and retries fetching data when no initial token", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    mockRefreshTokenUse.mockResolvedValue("new-refreshed-token");

    const refreshedPlaylists = [{ _id: "refreshed1", title: "After Refresh", songs: [] }];
    mockGetAllPlaylist.mockResolvedValue(refreshedPlaylists);

    const refreshedMoods = [{ name: "sad", icon: "😢" }];
    mockGetAllMoods.mockResolvedValue(refreshedMoods);

    const { findByText } = render(<HomeScreen />);

    await findByText("After Refresh");
    await findByText("Sad");

    expect(mockRefreshTokenUse).toHaveBeenCalled();
  });
});