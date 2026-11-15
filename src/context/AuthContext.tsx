import {createContext, useContext, useEffect, useState} from "react";
import type {User, AuthContextTypes} from "../share/types/User"
import {Navigate} from "react-router"
import Loading from "../components/Loading/Loading.tsx";
const AuthContext = createContext<AuthContextTypes | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean | null>(true);

    const SECRET_URL = import.meta.env.VITE_URL;

    useEffect(() => {
        fetch(`${SECRET_URL}/auth/me`, {credentials: "include"})
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default function GuestRouter({children}: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (user) return <Navigate to="/profile" replace />;

    return children;
}

export function ProtectedRouter({children}: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Loading/>
        );
    }

    if (!user) return <Navigate to="/register" replace />;
    return children;
}


export function useAuth(){

    const context = useContext(AuthContext);


    if(!context){
        throw new Error("useAuth нужно использовать внутри <AuthProvider>");
    }
    return context;
}