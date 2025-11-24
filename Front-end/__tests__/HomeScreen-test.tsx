import HomeScreen from "@/app/HomeScreen";
import { fireEvent, render } from "@testing-library/react-native";

jest.mock("@expo-google-fonts/irish-grover", () => ({
  useFonts: () => [true],
  IrishGrover_400Regular: {},
}));

jest.mock("@expo-google-fonts/montserrat", () => ({
  useFonts: () => [true],
  Montserrat_400Regular: {},
  Montserrat_700Bold: {},
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("matches snapshot", () => {
    const tree = render(<HomeScreen />);
    expect(tree).toBeTruthy();
  });
  it("renders default components", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("QUICK START")).toBeTruthy();
  });
  it("change page when click chill", () => {
    const { getByText } = render(<HomeScreen />);
    const chillButton = getByText("Chill");
    fireEvent.press(chillButton);
    expect(mockPush).toHaveBeenCalledWith("/CreateMoodPlaylistScreen");
  });
  it("renders all recent playlists", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Wibu Songs")).toBeTruthy();
    expect(getByText("Sad Songs")).toBeTruthy();
    expect(getByText("Lonely Songs")).toBeTruthy();
    expect(getByText("Allegory of the cave Songs")).toBeTruthy();
  });
});
