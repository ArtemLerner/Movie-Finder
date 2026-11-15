import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {User, AuthContextTypes} from "../share/types/User"

const AuthContext = createContext<AuthContextTypes | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const SECRET_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        fetch(`${SECRET_URL}/auth/me`, {credentials: "include"})
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUser(data))
            .catch(() => setUser(null))
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){

    const context = useContext(AuthContext);


    if(!context){
        throw new Error("useAuth нужно использовать внутри <AuthProvider>");
    }
    return context;
}