import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = true;

    return (
        isAuthenticated ? (
            <>{children}</>
        ) : (
            <Navigate to="/login" />
        )
    );
}

