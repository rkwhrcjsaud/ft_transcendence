import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export interface Auser {
    id: number;
    username: string;
    full_name: string;
    email: string;
}

export const useAuth = () => useContext(AuthContext);
