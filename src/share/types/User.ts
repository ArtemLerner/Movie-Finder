import type {Dispatch} from "react";
import type {SetStateAction} from "react";

export interface User {
    email: string;
}

export interface AuthContextTypes {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    loading: boolean | null;
}