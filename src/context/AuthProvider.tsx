import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../share/types/User";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const API_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        fetch(`${API_URL}/auth/me`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {setUser(data)})
            .catch(() => setUser(null))
            .finally(() => setLoading(false));

    }, [API_URL]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}