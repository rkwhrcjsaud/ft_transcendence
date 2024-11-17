import { createContext, useContext } from 'react';

const CustomUser = {
    username: "guest",
    email: "test@example.com",
    isAuthenticated: true
};

export const AuthContext = createContext(CustomUser);

export const useAuth = () => useContext(AuthContext);