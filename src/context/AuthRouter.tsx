import type { ReactElement } from "react";
import { Navigate } from "react-router";
import Loading from "../components/Loading/Loading.tsx";
import { useAuth } from "./AuthContext.tsx";

export function GuestRouter({ children }: { children: ReactElement }) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (user) return <Navigate to="/profile" replace />;

    return children;
}

export function ProtectedRouter({ children }: { children: ReactElement }) {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;
    if (!user) return <Navigate to="/register" replace />;

    return children;
}