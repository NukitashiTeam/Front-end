import Paginator from "@/Components/Paginator";
import { render } from "@testing-library/react-native";
import { Animated } from "react-native";

describe("Paginator", () => {
  it("renders correct number of dots", () => {
    const { getByText } = render(
      Paginator({
        data: [1, 2, 3],
        scrollX: new Animated.Value(0),
        index: 0,
      })
    );
    expect(getByText("1")).toBeTruthy();
  });
  it("highlights the correct dot based on index prop", () => {
    const { getByText } = render(
      Paginator({
        data: [1, 2, 3],
        scrollX: new Animated.Value(0),
        index: 1,
      })
    );
    const firstDot = getByText("1").parent.parent;
    const secondDot = getByText("2").parent.parent;
    const thirdDot = getByText("3").parent.parent;
    expect(firstDot?.props.style).toHaveProperty("backgroundColor", "#FFF");
    expect(secondDot?.props.style).toHaveProperty("backgroundColor", "#818BFF");
    expect(thirdDot?.props.style).toHaveProperty("backgroundColor", "#FFF");
  });
  it("matches snapshot", () => {
    const tree = render(
      Paginator({
        data: [1, 2, 3],
        scrollX: new Animated.Value(0),
        index: 0,
      })
    );
    expect(tree).toMatchSnapshot();
  });
});
