import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../share/types/User";
import { AuthContext } from "./AuthContext";
const CACHE_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });

    // если есть кэш — не показываем загрузку вообще
    const [loading, setLoading] = useState(() => !localStorage.getItem(CACHE_KEY));


    const API_URL = import.meta.env.VITE_URL;


    useEffect(() => {
        const controller = new AbortController();

        fetch(`${API_URL}/auth/me`, { credentials: "include", signal: controller.signal, })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setUser(data);
                if (data) localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                else localStorage.removeItem(CACHE_KEY);
                }

            )
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [API_URL]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}