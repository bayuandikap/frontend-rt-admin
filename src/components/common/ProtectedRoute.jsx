import { Navigate } from "react-router-dom";

/**
 * Redirects unauthenticated users to /login.
 * The Axios interceptor handles 401s mid-session,
 * but this guard prevents the page from rendering at all.
 */
export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
