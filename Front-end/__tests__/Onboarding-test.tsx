import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, TouchableOpacity } from "react-native";
import Onboarding from "../app/onboarding";
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

const mockReplace = jest.fn(() => "test");
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@/Components/BackgroundLayer", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockBackground = ({ children }: any) => (
    <View testID="mock-background">{children}</View>
  );

  return {
    __esModule: true,
    default: MockBackground,
  };
});

const mockPage = jest.fn();

jest.mock("@/Components/Paginator", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockPaginator = (props: any) => {
    mockPage(props);
    return <View testID="mock-paginator" />;
  };

  return {
    __esModule: true,
    default: MockPaginator,
  };
});

describe("Onboarding", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("test snapshot", () => {
    const tree = render(<Onboarding />);
    expect(tree).toMatchSnapshot();
  });

  it("test index = 0 when render first time", () => {
    render(<Onboarding />);

    const lastCall = mockPage.mock.calls.at(-1);
    expect(lastCall[0].index).toBe(0);
  });

  it("press Next then index increase 1", async () => {
    const { getByText } = render(<Onboarding />);

    let lastCall = mockPage.mock.calls.at(-1);
    expect(lastCall[0].index).toBe(0);

    fireEvent.press(getByText("Next"));

    await waitFor(() => {
      lastCall = mockPage.mock.calls.at(-1);
      expect(lastCall[0].index).toBe(1);
    });
  });

  it("press Skip then change page direction", async () => {
    const { getByText } = render(<Onboarding />);

    fireEvent.press(getByText("Skip!"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "hasSeenOnboarding",
        "true"
      );
      expect(mockReplace).toHaveBeenCalledWith("/HomeScreen");
      expect(mockReplace).toHaveReturnedWith("test");
    });
  });

  it("test skip button pressable ?", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <TouchableOpacity onPress={mockOnPress}>
        <Text>Skip!</Text>
      </TouchableOpacity>
    );
    const skipButton = getByText("Skip!");
    fireEvent.press(skipButton);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
