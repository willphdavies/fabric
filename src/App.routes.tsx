import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Login, Info } from "./View";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { CircularProgress } from "@mui/material";
export function AppRoutes() {
  const { loading } = useContext(AuthContext);
  return loading ? (
    <CircularProgress />
  ) : (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Login></Login>
        </Route>
        <PrivateRoute path="/info" exact={true}>
          <Info></Info>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

type PrivateRouteProps = {
  children: JSX.Element;
  path: string;
  exact: boolean;
};
export function PrivateRoute(props: PrivateRouteProps) {
  const { children, path, exact } = props;
  const { user, authenticate } = useContext(AuthContext);
  if (user == null && localStorage.getItem("auth_token")) {
    authenticate();
    return <></>;
  }
  return (
    <Route
      path={path}
      exact={exact}
      render={() =>
        user != null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
}
