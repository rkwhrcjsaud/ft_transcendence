import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const AuthLayout = () => {
    const Auth = useAuth();

    return (
        Auth.isAuthenticated ? (
            <Outlet />
        ) : (
            <Navigate to="/login" />
        )
    )
}