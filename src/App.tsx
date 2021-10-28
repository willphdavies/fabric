import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthProvider";
import { Login, Info } from "./View";
import "./App.css";
import { useContext } from "react";

function App() {
  return (
    <AuthProvider>
      <div className="App">
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
      </div>
    </AuthProvider>
  );
}

export default App;

type PrivateRouteProps = {
  children: JSX.Element;
  path: string;
  exact: boolean;
};
function PrivateRoute(props: PrivateRouteProps) {
  const { children, path, exact } = props;
  const { user } = useContext(AuthContext);
  return (
    <Route
      path={path}
      exact={exact}
      render={() =>
        user ? (
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
