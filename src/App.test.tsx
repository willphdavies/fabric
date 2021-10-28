import { render, screen } from "@testing-library/react";
import TestComponent from "./App";

const AppRoutes = () => <div>AppRoutes</div>;

jest.mock("./App.routes", () => ({
  AppRoutes,
}));

it("renders without crashing", () => {
  render(<TestComponent />);
});
it("renders App.routes", () => {
  render(<TestComponent />);
  expect(screen.getByText("AppRoutes")).toBeInTheDocument();
});
