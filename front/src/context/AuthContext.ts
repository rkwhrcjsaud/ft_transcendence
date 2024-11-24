import { createContext } from 'react';
import { Auser } from '../hooks/useAuth';

interface AuthContextType {
    isAuth: boolean;
    login: (user: Auser, access_token: string, refresh_token: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);