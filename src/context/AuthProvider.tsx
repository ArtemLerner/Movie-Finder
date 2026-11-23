import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../share/types/User";
import { AuthContext } from "./AuthContext";
import {checkMe} from "../api/auth.ts";


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        (async () => {
           try {
                await checkMe(setUser);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })()
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}