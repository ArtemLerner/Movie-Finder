import {createContext, type ReactNode, useContext, useState} from "react";
import type {User, AuthContextTypes} from "../share/types/User"

const AuthContext = createContext<AuthContextTypes | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (

        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}