import { createContext, useContext } from "react";
import type { AuthContextTypes } from "../share/types/User";


export const AuthContext = createContext<AuthContextTypes | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}