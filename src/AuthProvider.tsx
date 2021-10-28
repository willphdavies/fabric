import { useState, createContext } from "react";
import Api from "./api/Api";

type AuthContextProps = {
  user: User | null
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

type User = {
  username: string;
  applicationPath: string;
  currentTime: string;
};
type AuthResponse = {
  success: boolean;
  result: User;
};
type AuthProviderProps = {
  children: JSX.Element
}
export function AuthProvider(props: AuthProviderProps) {
  const { children } = props
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const authenticate = () => {
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
        localStorage.removeItem('auth_token');
        throw err;
      });
    }

  const login = (username: string, password: string) => {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
  }

  return (
    <AuthContext.Provider value={{user, loading, login, logout, authenticate}}>
      {children}
    </AuthContext.Provider>
  );
}