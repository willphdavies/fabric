import { useState, createContext } from "react";
import Api from "./api/Api";

type AuthContextProps = {
  user: AuthenticatedUser | null
  loading: boolean
  login: (_: string, _password: string) => Promise<boolean>
  logout: () => void
  authenticate: () => Promise<boolean>
}
const initalContext: AuthContextProps = {
  user: null,
  loading: false,
  login: () => Promise.resolve(true),
  logout: () => {},
  authenticate: () => Promise.resolve(true),
};
export const AuthContext = createContext(initalContext);

type AuthenticatedUser = {
  username: string;
  applicationPath: string;
  currentTime: string;
};
type AuthResponse = {
  success: boolean;
  result: AuthenticatedUser;
};
type AuthProviderProps = {
  children: JSX.Element
}
export function AuthProvider(props: AuthProviderProps) {
  const { children } = props
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  function authenticate() {
    if (!loading) {
      setLoading(true);
      return Api.get("/api/user/me", {})
        .then((response: AuthResponse) => {
          setLoading(false);
          if (response.success) {
            setUser(response.result);
            return true
          }
          localStorage.removeItem('auth_token');
          return false;
        })
        .catch((err: any) => {
          setLoading(false);
          localStorage.removeItem('auth_token');
          throw err;
        });
    }
    return Promise.resolve(true);
  }

  function login(username: string, password: string) {
    return Api.post('/api/authenticate', { params: { username, password } })
      .then((response) => {
        if (response.success) {
          localStorage.setItem('auth_token', response.token);
          return authenticate();
        }
        return false;
      })
      .catch((err: any) => { throw err });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('auth_token');
  }

  return (
    <AuthContext.Provider value={{user, loading, login, logout, authenticate}}>
      {children}
    </AuthContext.Provider>
  );
}