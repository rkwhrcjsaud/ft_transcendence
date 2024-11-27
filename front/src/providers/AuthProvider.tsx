import { useLayoutEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Auser } from "../hooks/useAuth";

export default function AuthProvider() {
  const isAuth = useLoaderData() as boolean;

  return (
      <AuthContext.Provider value={AuthValue(isAuth)}>
          <Outlet></Outlet>
      </AuthContext.Provider>
  );
};

interface AuthReturnType {
  isAuth: boolean;
  login: (user: Auser, access_token: string, refresh_token: string) => Promise<boolean>;
  logout: () => void;
};

function AuthValue(isJWTAuth: boolean): AuthReturnType {
  const [isAuth, setIsAuth] = useState<boolean>(isJWTAuth);
  
  const login = async (user: Auser, access_token: string, refresh_token: string): Promise<boolean> => {
    console.log("login");
    try {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuth(true);
        return true;
    } catch {
        return false;
    }
  }

  const logout = () => {
      console.log("logout");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setIsAuth(false);
  }

  useLayoutEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuth(!!token && isJWTAuth);
  }, [isJWTAuth]);

  return { isAuth, login, logout };
}
