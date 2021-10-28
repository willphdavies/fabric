import { render } from "@testing-library/react";
import { AppRoutes as TestComponent } from "./App.routes";
import { AuthContext } from "./AuthProvider";

const authenticate = jest.fn();
const login = jest.fn();
const logout = jest.fn();

it("renders without crashing", () => {
  const context = {
    loading: false,
    user: null,
    authenticate,
    login,
    logout,
  };
  render(
    <AuthContext.Provider value={context}>
      <TestComponent />
    </AuthContext.Provider>
  );
});
it("renders App.routes", () => {
  const context = {
    loading: false,
    user: null,
    authenticate,
    login,
    logout,
  };
  render(
    <AuthContext.Provider value={context}>
      <TestComponent />
    </AuthContext.Provider>
  );
});
